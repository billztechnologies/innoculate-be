const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')
// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.MAILGUN_ACTIVE_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  }
}
const transport = mailgunTransport(mailgunOptions)
// EmailService
class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(transport)
  }
  sendText(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail({
        from: '"Inocul8" <info@inocul8.com.ng>',
        to,
        subject,
        html,
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
module.exports = new EmailService()