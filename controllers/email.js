const nodemailer = require("nodemailer");
const {trimiteEroare} = require("./sms");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
    },
});

function emailTrimisCertificat(mailOptions, dataError) {
    let flag = 1;
    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
            trimiteEroare(dataError);
            flag = 0;
        } else {
            console.log("Email Trimis Client");
        }
    });
    return flag;
}

module.exports = {
    trimiteEmail: emailTrimisCertificat,
};