const Datauri = require('datauri');
const path = require('path');

const cloudinary = require('../config/cloudinary');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("SG.M5Vt3DBUTby3M_eeGAV3kQ.8po3tR8NnAfTRBMhIV8VMEMGq0eebTKLpTfZySgbyoE");

function uploader(req) {
    return new Promise((resolve, reject) => {
        const dUri = new Datauri();
        let image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    });
}

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

module.exports = { uploader, sendEmail };