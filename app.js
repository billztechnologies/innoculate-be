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
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization, Access-Control-Allow-Origin');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization, Access-Control-Allow-Origin');

  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser())
// app.use(session({ secret: process.env.SESSION_ONE }));
 async function twoWeeksLater(){
    await indivVacc.find({next_stage: {$ne: 'done'}}, (err, indiv)=>{
        let schedIndivTwoWeeks = indiv.filter((indivNotDone)=>{
            let today = moment('2021/01/14', 'YYYY/MM/DD');
            let nextVacc = new Date(indivNotDone.nextVaccDate)
            // let formattedToday = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
            let formattedNextVacc= nextVacc.getFullYear() + '-' + (nextVacc.getMonth()+1) + '-' + nextVacc.getDate()
           return moment(today, 'YYYY/MM/DD').diff( moment(formattedNextVacc, 'YYYY/MM/DD') , 'days') === -14
        })
        if(schedIndivTwoWeeks.length > 0){
           
            schedIndivTwoWeeks.map(indiv_sched_twoweeks=>{
                let fname = indiv_sched_twoweeks.patientFirstName;
                let lastname = indiv_sched_twoweeks.patientLastName;
                let vaccine = indiv_sched_twoweeks.vaccine;
                let vaccNum = indiv_sched_twoweeks.firstVaccPhoneNo;
                let vaccstages = indiv_sched_twoweeks.vaccstages;
                let clientmessage = `Dear ${fname},  Please be kindly reminded that your next vaccine shot will be due in two(2) weeks. For more information, please call: ${vaccNum}.
                Vaccine: ${vaccine.name},
                Vaccine brand: ${vaccine.brand}, ${vaccine.price},
                Dose count: ${indiv_sched_twoweeks.next_stage}`;
                let vaccMessage = `Hello ${vaccstages[vaccstages.length - 1].vaccinator},

                Your client's (${fname}) ${indiv_sched_twoweeks.next_stage} vaccination will be due in two(2) weeks. Kindly follow up with the client. 
                
                
                Client details
                Name: ${fname} ${lastname}
                Phone no: ${indiv_sched_twoweeks.patientPhone_no}
                Email: ${indiv_sched_twoweeks.email}
                Vaccine: ${vaccine.name}
                Brand: ${vaccine.brand}, ${vaccine.price}
                Dose count: ${indiv_sched_twoweeks.next_stage}`

                // admin message reminder
                let adminMessage = `Hello Inocul8 Admin,

                Your client (${fname} ${lastname}), who was vaccinated by ${vaccstages[vaccstages.length - 1].vaccinator}, ${indiv_sched_twoweeks.next_stage} vaccination will be due in two(2). Kindly follow up with the Pharmacy. 
                
                Vaccinator details
                Name: ${vaccstages[vaccstages.length - 1].vaccinator}
                Phone no: ${vaccstages[vaccstages.length - 1].phone}
                Email: ${vaccstages[vaccstages.length - 1].email}
                
                Client details
                Name: ${fname} ${lastname}
                Phone no: ${indiv_sched_twoweeks.patientPhone_no}
                Email: ${indiv_sched_twoweeks.email}
                `
               
                    emailService.sendText(
                        indiv_sched_twoweeks.email,
                        "Vaccination Reminder",
                        clientmessage
                      )
                        .then(() => {
                          console.log("message sent");
                        })
                        .catch(() => {
                          console.log("Error");
                        });
                          // vaccinator email for vaccine reminder
                      // 
                      emailService.sendText(
                        vaccstages[vaccstages.length - 1].email,
                        "Vaccination Reminder",
                       vaccMessage
                      )
                        .then(() => {
                          console.log("message sent");
                        })
                        .catch(() => {
                          console.log("Error");
                        });

                    // admin email for vaccine reminder
                    // 
                    // 
                    // emailService.sendText(
                    //       'info@inocul8.com.ng',
                    //       "Vaccination Reminder",
                    //      adminMessage
                    //     )
                    //       .then(() => {
                    //         console.log("message sent");
                    //       })
                    //       .catch(() => {
                    //         console.log("Error");
                    //       });
                        
            })
        } else{
            console.log('no reminder here')
        }
        console.log(schedIndivTwoWeeks)
    })
};
async function twoDaysLater(){
    await indivVacc.find({next_stage: {$ne: 'done'}}, (err, indiv)=>{
        let schedIndivTwoDays = indiv.filter((indivNotDone)=>{
            let today = moment('2021-01-26', 'YYYY-MM-DD');
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
                let lastname = indiv_sched_twodays.patientLastName;
                let vaccNum =  indiv_sched_twodays.firstVaccPhoneNo;
                let vaccine = indiv_sched_twodays.vaccine;
                let vaccstages = indiv_sched_twodays.vaccstages

                // client message reminder
                // 
                let clientmessage = `Dear ${fname},  Please be kindly reminded that your next vaccine shot will be due in two(2) weeks. For more information, please call: ${vaccNum}.


Vaccine:  ${vaccine.name},
Vaccine brand:  ${vaccine.brand}, ${vaccine.price},
Dose count:  ${indiv_sched_twodays.next_stage}`;

              // vaccinator message reminder
              let vaccMessage = `Hello ${vaccstages[vaccstages.length - 1].vaccinator},

                Your client's (${fname}) ${indiv_sched_twodays.next_stage} vaccination will be due in 2days. Kindly follow up with the client. 
                
                
                Client details
                Name: ${fname} ${lastname}
                Phone no: ${indiv_sched_twodays.patientPhone_no}
                Email: ${indiv_sched_twodays.email}
                Vaccine: ${vaccine.name}
                Brand: ${vaccine.brand}, ${vaccine.price}
                Dose count: ${indiv_sched_twodays.next_stage}`

                // admin message reminder
                let adminMessage = `Hello Inocul8 Admin,

                Your client (${fname}, ${lastname}) who was vaccinated by ${vaccstages[vaccstages.length - 1].vaccinator}, ${indiv_sched_twodays.next_stage} vaccination will be due in 2days. Kindly follow up with the Pharmacy. 
                
                Vaccinator details
                Name: ${vaccstages[vaccstages.length - 1].vaccinator}
                Phone no: ${vaccstages[vaccstages.length - 1].phone}
                Email: ${vaccstages[vaccstages.length - 1].email}
                
                Client details
                Name: ${fname} ${lastname}
                Phone no: ${indiv_sched_twodays.patientPhone_no}
                Email: ${indiv_sched_twodays.email}
                `
                // client sms reminder
                // 
                // 
                twilioService.sendSms("+2348130427849", 'Inocul8', clientmessage)
                     .then(() => {
                        console.log("message sent");
                      })
                      .catch((err) => {
                          console.log("message not sent")
                        throw err;
                    
                    });
                    // client email for  vaccine reminder
                    // 
                    // 
                    emailService.sendText(
                        indiv_sched_twodays.email,
                        "Vaccination Reminder",
                       clientmessage
                      )
                        .then(() => {
                          console.log("message sent");
                        })
                        .catch(() => {
                          console.log("Error");
                        });
                        // 
                      // vaccinator email for vaccine reminder
                      // 
                        emailService.sendText(
                          vaccstages[vaccstages.length - 1].email,
                          "Vaccination Reminder",
                         vaccMessage
                        )
                          .then(() => {
                            console.log("message sent");
                          })
                          .catch(() => {
                            console.log("Error");
                          });

                      // admin email for vaccine reminder
                      // 
                      // 
                      // emailService.sendText(
                      //       'info@inocul8.com.ng',
                      //       "Vaccination Reminder",
                      //      adminMessage
                      //     )
                      //       .then(() => {
                      //         console.log("message sent");
                      //       })
                      //       .catch(() => {
                      //         console.log("Error");
                      //       });
            })
        } else{
            console.log('no reminder here')
        }
        // console.log(schedIndivTwoDays)
    })
}
cron.schedule('0 1 * * *',  async () => {
   twoWeeksLater();
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