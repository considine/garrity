exports = module.exports = {};

    

'use strict';
exports.send = function (request, func) {
    
    var html = request.text;
    var imgs = request.imgs;
    var subject = request.subject;


    var cid = "jconsidi@jconsidi.com";
    var my_cid;

    var img_to_cid = {};

    for (var i=0; i<imgs.length; i++) {
        my_cid = cid + parseInt(imgs[i]);
        html = html.replace(imgs[i], "cid:" + my_cid);
        img_to_cid[imgs[i]] = my_cid;
    }


    var attachments = [];
    for (var i=0; i<imgs.length; i++) {
        var temp = {
            filename: imgs[i],
            path: __dirname + '/../../public/uploads/emailImages/' + imgs[i],
            cid: img_to_cid[imgs[i]] //same cid value as in the html img src
        };
        attachments.push(temp);
    }
    


    console.log(attachments);
    console.log(html);
    // return;

    // create reusable transporter object using the default SMTP transport
    const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jconsidi@nd.edu',
                pass: 'JackConsidine!'
            }
        });

    // setup email data with unicode symbols
    // set html

    let mailOptions = {
        from: '"Jack Considine" <jconsidi@nd.edu>', // sender address
        to: 'enadal@nd.edu, jconsidi@nd.edu, jackconsidine3@gmail.com', // list of receivers
        subject: subject, // Subject line
        html: html,
        attachments: attachments

    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
        func();
    });
}