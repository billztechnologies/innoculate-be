const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:'String',
        required: true,
        trim: true,
    },
    email:{
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type:'String',
        required: true,
        trim: true
    },
    role:{
        type:'String',
        required:true
    },
    state:{
        type:'String',
        required: true
    },
    localgovt:{
        type:'String',
        required: true
    },
    newassigned_id: '',
    bookings: [],
    done: {
        type: Boolean
    },
    timestamp: {
        type: Date,
        required: true
    }

});

userSchema.pre("save", (next)=>{
    const user = this;
    if(!user.isModified || !user.isNew){
        next();
    } else {
        bcrypt.hash(user.password, stage.saltingRounds, (err, hash)=>{
            if(err){
                console.log("Error:cannot hash password", user.name);
                next(err);
            } else{
                user.password = hash;
                next();
            }
        })
    }
})

module.exports = mongoose.model("User", userSchema);