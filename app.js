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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const async = require('async')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const expressLimit = require('express-rate-limit')
const handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');

const limiter = expressLimit({windowMs: 60000, max: 10})
app.use(cors('*'))
// app.use(limiter)

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type, Accept, Authorization");
//     res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With,Content-Type, Accept, Authorization")
//     // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, PATCH, DELETE");
//     if(req.method === 'OPTIONS'){
//         res.header("Access-Control-Allow-Methods", "PUT, GET, POST, PATCH, DELETE");
//         return res.status(200).json({})
//     }
//     next()
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser())
// app.use(session({ secret: process.env.SESSION_ONE }));


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