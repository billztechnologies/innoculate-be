const http = require('http');
const nodemailer = require('nodemailer');

module.exports={
    sendmail :(req, res)=>{
        let transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "89836933fddd68",
              pass: "2338ec3e09708f"
            }
          });
          let mailOptions = {
            // should be replaced with real recipient's account
            to: 'mathildaimadojiemu@gmail.com',
            subject: req.body.subject,
            text: req.body.message
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        res.writeHead(200);
        res.end();
    }
}
