const twiliosid = process.env.TWILIO_ACCOUNT_SID;
const twilioauth = process.env.TWILIO_AUTH_TOKEN;

const twilio = require('twilio')(twiliosid, twilioauth);

class TwilioService{
    constructor(){}

    sendSms(to, from, body){
        return new Promise((resolve, reject)=>{
            twilio.messages
            .create({
                body: body,
                from: from,
                to: to,
                }, (err, info) => {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(info)
                    }
                  })
        })
    }
}

module.exports = new TwilioService()