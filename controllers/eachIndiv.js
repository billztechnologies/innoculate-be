const indivVacc = require('../models/eachIndivVacc');
const mongoose = require("mongoose");
require('dotenv/config');
const moment = require("moment");
const Vaccine = require('../models/vaccines');


let next ;
let nextvacc = null;
let completed = false;


async function calcDate(dategiven, vacc_id,age, next_stage){
    let filter = {_id: vacc_id};
    await Vaccine.findOne(filter, (err, vacc)=>{
       if(!err){
           if(!vacc.description.dosages){
               console.log(err)
           }
           if(vacc.description.dosages){
           for(let i = 0; i < vacc.description.dosages.length; i++){
            if(age <= vacc.description.dosages[i].endAge && age >= vacc.description.dosages[i].startAge){
                 dayNum = vacc.description.dosages[i].patientdosages
            } else{
                dayNum = null
            } 
        }
        } 
        if(dayNum[next_stage] === undefined){
            nextvacc = null;
            completed = true
           } else{
            next = dayNum[next_stage];
            nextvacc = moment(dategiven).add(dayNum[next_stage], "days");
            completed = false; 
           };
             
       
    } else {
            return res.status(404).json({message:"bad request, not found"})
        };
            
    })
   
    return {nextvacc, completed, next}
}

module.exports ={
    addIndiv: async (req, res)=>{
        mongoose.connect(
            process.env.DB_CONNECTION,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            async (err) => {
                let result = {}
                if(!err){
                    let dayNum;
                    console.log('blast')
                    //  write a function that helps to filter all vaccines, get the timing and pass it to get next vaccination date,
                    //  and pass it to know if the booking is completed or not 
                    const nextVaccdate= async ()=>{
                        console.log('mad ooohhhh');
                        let filter = {_id: req.body.vaccstages[req.body.vaccstages.length - 1].vaccine_id};
                       await Vaccine.findOne(filter, async (err, vacc)=>{
                           console.log(vacc)
                           if(!err){
                          
                               if(vacc.description.dosages.length === 0){
                                   return res.status(400).json({
                                       message:'dosage intervals not added, please try to add dosage intervals and try again'
                                   })
                               } console.log('sec')
                               if(vacc.description.dosages){
                                for(let i = 0; i < vacc.description.dosages.length; i++){
                                    if(req.body.age <= vacc.description.dosages[i].endAge && req.body.age >= vacc.description.dosages[i].startAge){
                                         dayNum = vacc.description.dosages[i].patientdosages
                                    } else{
                                        dayNum = null
                                        return res.status(400).json({
                                            message:'age is above or below the prescribed dosage age'
                                        })
                                    }
                                }
                               } else{
                                   console.log('not found')
                               }
                               
                            
                           } else {
                               return res.status(404).json({message:"bad request, not found"})
                           };
                           let next = dayNum[req.body.next_stage];
                            let nextvacc = moment( req.body.vaccstages[(req.body.vaccstages.length) - 1].dategiven).add(dayNum[req.body.next_stage], "days");
                            let completed = false;
                            console.log(nextvacc)

                           
                           const eachIndiv = new indivVacc({
                            patientFirstName: req.body.firstname,
                            patientLastName: req.body.lastname,
                            firstVaccPhoneNo: req.body.vaccPhone_no,
                            patientPhone_no: req.body.phone_no,
                            patientAge: req.body.age,
                            email: req.body.email,
                            paymentStatus: req.body.paymentStatus,
                            category: req.body.category,
                            serviceType: req.body.serviceType,
                            booking_id: req.body.bookingId,
                            next_stage: req.body.next_stage,
                            vaccine: req.body.vaccine,
                            nextVaccDate: nextvacc,
                            is_completed: completed,
                            vaccstages: req.body.vaccstages
                        });
                        console.log(eachIndiv)
                        
                       await eachIndiv.save((err, eachIndiv)=>{
                            if(!err){
                                result.status = 201;
                                result.eachIndiv = eachIndiv
                                return res.status(201).json({message: "individual record created successfully", result})
                            } else {
                                result.status = 400;
                                return res.status(400).json({
                                    // message: "record not created, bad request, please try again",
                                    err,
                                    result                                     
                                })
                            }
                        })
                        })
                        .catch(err =>{
                            return res.status(500).json({message:"error getting details"})
                        })
                    }
                    await nextVaccdate();
                   
                } else {
                    return res.status(500).json({
                        message: "internal server error, check network"
                    })
                }
            })
        },
        checkIndiv: async (req, res)=>{
            let filter = {
                patientFirstName: req.body.firstname, 
                patientLastName: req.body.lastname,
                booking_id: req.body.bookingId, 
                category: req.body.category, 
                "vaccstages.vaccine_id": req.body.vaccDose.vaccine_id
             };
             let stageMatch;
            await indivVacc.findOne(filter, async  (err, indivVac)=>{
                // console.log(indivVac.vaccstages);
                stageMatch = await indivVac.vaccstages.filter((stage)=>{
                    console.log(stage.currstage, req.body.vaccDose.currstage)
                    return stage.currstage === req.body.vaccDose.currstage
                })
            });
            console.log(stageMatch)
            if( stageMatch.length > 0 ){
                return res.status(400).json({
                    message: "current stage has already been filled, choose next stage :|"
                })
            };
            return res.status(200).json({
                message: "stage has not been added yet, continue"
            })
        },
        updateIndiv: (req, res)=>{
            mongoose.connect(
                process.env.DB_CONNECTION,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
                async (err) => {
                    let result = {}
                    if(!err){
                       let filter = {
                        patientFirstName: req.body.firstname, 
                        patientLastName: req.body.lastname,
                           booking_id: req.body.bookingId, 
                           category: req.body.category, 
                           "vaccstages.vaccine_id": req.body.vaccDose.vaccine_id
                        };
                        let xdate = await calcDate(req.body.vaccDose.dategiven, req.body.vaccDose.vaccine_id, req.body.age, req.body.next_stage);
                        console.log(xdate)
                        let individual = await indivVacc.findOneAndUpdate(filter, {   $addToSet:{
                            vaccstages : req.body.vaccDose
                        },  
                        next_stage: req.body.next_stage, nextVaccDate: nextvacc, is_completed: completed}, async function(err, indiv){
                       
                        if(err){
                            return res.status(404).json({
                                message: "not found, check your request",
                                result
                            })
                        }
                    });
                   
                    
                    result.result = individual
                    // console.log(individual);
                    return res.status(200).json({
                        message: "successful",
                        result
                    })
                    } else {
                        return res.status(500).json({
                            message: "internal server error"
                        })
                    }
                })
            },
        searchPatients: async (req, res)=>{
            mongoose.connect(
                process.env.DB_CONNECTION,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
                async (err) => {
                    if(!err){
                        const searchedquery = req.query.patient
                        // const searchedlastname = req.query.lastname
                       await indivVacc.find({patientFirstName: {$regex: searchedquery, $options: '$i'}}, async (err, partIndiv)=>{
                        // if(partIndiv.length === 0){
                        //     res.status(404).json({message: "not found", err})
                        // }
                        if(!err && partIndiv.length > 0){
                           res.status(200).json({message: "found", partIndiv})
                        } else{
                            // res.status(400).json({message: "bad request, try either first name, lastname or email", err})
                       await indivVacc.find({patientLastName: {$regex: searchedquery, $options: '$i'}},async (err, partIndiv)=>{
                        if(!err && partIndiv.length > 0){
                            res.status(200).json({message: "found", partIndiv})
                         } else{
                            await indivVacc.find({email: {$regex: searchedquery, $options: '$i'}},async (err, partIndiv)=>{
                                if(!err && partIndiv.length > 0){
                                    res.status(200).json({message: "found", partIndiv})
                                 } else{
                                     res.status(404).json({message: 'not found', err})
                                 }
                         })
                        }
                            
                        })
                       }
                    })
           
        }
    })
}
}