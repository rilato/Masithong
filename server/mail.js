require("dotenv").config();
const mailer = require("nodemailer");
const { Hello } = require("./hello_template");

const getEmailData = (to, authCode) => {
    data = {
        from: "Welcome",
        to,
        subject: "Hello",
        html: Hello(authCode),
    };
    return data;
};

const sendEmail = (to, authCode) => {
    const smtpTransport = mailer.createTransport({
        service: "",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "welcomemsh1234@gmail.com", //보내는 사람 이메일
            pass: "kdqexkgpmytfamba", // 비밀번호
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const mail = getEmailData(to, authCode);
    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            alert("email sent successfully");
        }
        smtpTransport.close();
    });
};

module.exports = { sendEmail };