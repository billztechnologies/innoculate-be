const Myself = require('../models/myform');
const mongoose = require("mongoose");
const Family = require('../models/famform')
const User = require('../models/users')


module.exports = {
    updateMy: (req, res) => {
      mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
        async (err) => {
            let result = {};
            let status = 200;
            let filter = {"profile.email":req.body.email, "profile.firstname": req.body.firstname, "profile.lastname": req.body.lastname}
            let other ={}
            console.log(filter)
            let update = {paymentStatus: req.body.paymentStatus}
            if(!err){
               let doc = await Myself.findOneAndUpdate(filter, update, {
                    new: true
                })
                if(doc !== null){doc.save()} else{console.log(null)}
                
                console.log(doc)
            } else{
                let status = 500;
                result.status = status
                result.result = 'done'
            }
            res.status(status).send(result)
        }
      ).catch((err)=>{
          console.log('Error', err)
      })},
      updateMyAdmin: (req, res) => {
        mongoose.connect(
          process.env.DB_CONNECTION,
          { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
          async (err) => {
              let result = {};
              let status = 200;
              let filter = {"profile.email":req.body.profile.email, "profile.firstname": req.body.profile.firstname, "profile.lastname": req.body.profile.lastname}
              let other ={}
              console.log(filter)
              let update = {paymentStatus: req.body.paymentStatus}
              if(!err){
                 let doc = await Myself.findOneAndUpdate(filter, update, {
                      new: true
                  })
                  if(doc !== null){doc.save()} else{console.log(null)}
                  
                  console.log(doc)
              } else{
                  let status = 500;
                  result.status = status
                  result.result = 'done'
              }
              res.status(status).send(result)
          }
        ).catch((err)=>{
            console.log('Error', err)
        })},
  

      updateFam: (req, res) => {
        mongoose.connect(
          process.env.DB_CONNECTION,
          { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
          async (err) => {
              let result = {};
              let status = 200;
              let firstfilt =[]
              let lastfilt =[]
              let email = []
            
              let filter = {"profile.firstname": req.body.profile[0].firstname, "profile.lastname": req.body.profile[0].lastname, "profile.email": req.body.profile[0].email, "profile.phone": req.body.profile[0].phone}
              console.log(filter)
              let update = {paymentStatus: req.body.paymentStatus}
              if(!err){
                 let doc = await Family.findOneAndUpdate(filter, update, {
                      new: true
                  })
                  if(doc !== null){doc.save()} else{console.log(null)}
                  
                  console.log(doc)
              } else{
                  let status = 500;
                  result.status = status
                  result.result = 'done'
              }
              res.status(status).send(result)
          }
        ).catch((err)=>{
            console.log('Error', err)
        })},
        updateNurseBooking: (req, res) => {
            mongoose.connect(
              process.env.DB_CONNECTION,
              { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
              async (err) => {
                  let result = {};
                  let status = 200;
                  let filter = {"name":req.body.name, "email": req.body.email, "state": req.body.state, "localgovt": req.body.localgovt}
                  console.log(filter)
                  let update = {bookings: req.body.bookings}
                  if(!err){
                     let nurse = await User.findOneAndUpdate(filter, update, {
                          new: true
                      })
                      if(nurse !== null){nurse.save()} else{console.log(null)}
                      
                      console.log(nurse)
                  } else{
                      let status = 500;
                      result.status = status
                      result.result = 'done'
                  } 
                  res.status(status).send(result)
              }
            ).catch((err)=>{
                console.log('Error', err)
            })},
}