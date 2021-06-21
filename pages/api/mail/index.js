import nodemailer from "nodemailer";

export default function SendEmail(req, res) {
  const emailBody = `Клиент : ${req.body.name}, Телефон: ${
    req.body.tel
  }, Продукт: ${JSON.stringify(req.body.product)}`;
  const token = req.body.token;

  const sendMail = nodemailer;

  const transporter = sendMail.createTransport({
    service: "gmail",
    auth: {
      user: "theodlo@gmail.com",
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "theodlo@gmail.com",
    to: "deni@royal-cleaning.co.uk",
    subject: "Ново запитване Vitalize.bg",
    text: emailBody,
  };
  if (token === process.env.MAIL_VERIFY) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).res.end();
      }
    });
    res.status(200);
    res.end();
  } else {
    console.log("Someone tried to send an email without a token");
    res.end();
  }
}
