const express = require("express");
const app = express();
const bodyParser = require("body-parser")
require('dotenv').config();
const router = express.Router();
const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];
const logger = require("morgan");
const routes =require("./routes/index.js")
const cors = require('cors')
const mongoose = require('mongoose')
const cron = require('node-cron');
const cookieParser = require('cookie-parser')
const expressLimit = require('express-rate-limit')
const handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');
const moment = require("moment");
const indivVacc = require('./models/eachIndivVacc');
const twilioService = require('./services/twilioServices')
const emailService = require('./services/emailServices')


app.use(cors())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser())
// app.use(session({ secret: process.env.SESSION_ONE }));
 async function oneWeekLater(){
    await indivVacc.find({next_stage: {$ne: 'done'}}, (err, indiv)=>{
        let schedIndivOneWeek = indiv.filter((indivNotDone)=>{
            let today = moment();
            let nextVacc = new Date(indivNotDone.nextVaccDate)
            // let formattedToday = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
            let formattedNextVacc= nextVacc.getFullYear() + '-' + (nextVacc.getMonth()+1) + '-' + nextVacc.getDate()
           return moment(today, 'YYYY/MM/DD').diff( moment(formattedNextVacc, 'YYYY/MM/DD') , 'week') === -7
        })
        if(schedIndivOneWeek.length > 0){
           
            schedIndivOneWeek.map(indiv_sched_oneweek=>{
                let fname = indiv_sched_oneweek.patientFirstName;
                let vaccNum = indiv_sched_oneweek.firstVaccPhoneNo
                twilioService.sendSms(`${indiv_sched_oneweek.phone_no}`, 'Inocul8',
                `Dear ${fname}, Please be Kindly reminded that your next vaccine shot will be due in one week.  For more info: ${vaccNum}`)
                     .then(() => {
                        console.log("message sent");
                      })
                      .catch((err) => {
                          console.log("message not sent")
                        throw err;
                    
                    });
                    emailService.sendText(
                        indiv_sched_oneweek.email,
                        "Vaccination Reminder",
                        `Dear ${fname}, Please be Kindly reminded that your next vaccine shot will be due in one week.  For more info: ${vaccNum}`
                      )
                        .then(() => {
                          console.log("message sent");
                        })
                        .catch(() => {
                          console.log("Error");
                        });
            })
        } else{
            console.log('no reminder here')
        }
        console.log(schedIndivOneWeek)
    })
};
async function twoDaysLater(){
    await indivVacc.find({next_stage: {$ne: 'done'}}, (err, indiv)=>{
        let schedIndivTwoDays = indiv.filter((indivNotDone)=>{
            let today = moment();
            let nextVacc = new Date(indivNotDone.nextVaccDate)
            // let formattedToday = today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate();
            let formattedNextVacc= nextVacc.getFullYear() + '/' + (nextVacc.getMonth()+1) + '/' + nextVacc.getDate()
            // console.log(today)
            // console.log(moment(today, "YYYY/MM/DD").diff( moment(formattedNextVacc, "YYYY/MM/DD"), 'days'))
           return moment(today, "YYYY/MM/DD").diff( moment(formattedNextVacc, "YYYY/MM/DD"), 'days') === -2
        })
        if(schedIndivTwoDays.length > 0){
            console.log(schedIndivTwoDays);
            schedIndivTwoDays.map(async (indiv_sched_twodays)=>{
              console.log( indiv_sched_twodays.firstVaccPhoneNo)
                let fname = indiv_sched_twodays.patientFirstName
                let vaccNum =  indiv_sched_twodays.firstVaccPhoneNo
                
                await twilioService.sendSms(`+234${indiv_sched_twodays.patientPhone_no}`, 'Inocul8',
                `Dear ${fname}, Please be Kindly reminded that your next vaccine shot will be due in two(2) days.  For more info: ${vaccNum}`
                )
                     .then((res) => {
                        console.log("message sent");
                      })
                      .catch((err) => {
                          console.log("message not sent")
                        throw err;
                    
                    });
                    emailService.sendText(
                        indiv_sched_twodays.email,
                        "Vaccination Reminder",
                        `Dear ${fname}, Please be kindly reminded that your next vaccine shot will be due in two(2) days.  For more info: ${vaccNum}`
                      )
                        .then(() => {
                          console.log("message sent");
                        })
                        .catch(() => {
                          console.log("Error");
                        });
            })
        } else{
            console.log('no reminder here')
        }
        // console.log(schedIndivTwoDays)
    })
}
cron.schedule ('0 1 * * *',  async () => {
   oneWeekLater();
   twoDaysLater();
});

const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, 'templates', "/resetTemplate.hbs"),
    "utf8"
  );
  const template = handlebars.compile(emailTemplateSource);

if(environment !== 'production'){
    app.use(logger('dev'))
}

app.use('/api/v1', routes(router))


// connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },()=>{
        console.log("db connection successful")
    })

//listen at port 3000
app.listen(`${stage.port}`, ()=>{
    console.log(`app is now running on port: ${stage.port}`)
})