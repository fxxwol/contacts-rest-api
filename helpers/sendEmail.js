const nodemailer = require("nodemailer");
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, 
    secure: true,
    auth: {
        user: "phonebookservice@meta.ua",
        pass: META_PASSWORD
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    try {
        
        const email = { ...data, from: "phonebookservice@meta.ua" };
        await transport.sendMail(email);
    } catch (error) {
        console.log(error)
    }
    return true;
}

module.exports = sendEmail;
