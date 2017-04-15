'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jconsidi@nd.edu',
        pass: 'JackConsidine!'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Jack Considine" <jconsidi@nd.edu>', // sender address
    to: 'enadal@nd.edu, jconsidi@nd.edu, jackconsidine3@gmail.com', // list of receivers
    subject: 'HTS', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Whats up</b> Embedded image: <img src="cid:jconsidi@jconsidi.com"/>',
    attachments: [{
        filename: 'image.png',
        path: './image.png',
        cid: 'jconsidi@jconsidi.com' //same cid value as in the html img src
    }] // html body
};


// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
