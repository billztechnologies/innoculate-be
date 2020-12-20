const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const crypto = require('crypto')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:'String',
        required: true,
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
    phone:{
        type: Number,
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
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, {timestamps: true});

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
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        name: this.name
    };

    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model("User", userSchema);