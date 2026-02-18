import nodemailer from "nodemailer";

const sendEmail = async (mailOptions) => {
  const port = process.env.SMTP_PORT || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: port == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Allow connections from cloud servers
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  const sendMessage = async (message) => {
    await transporter.sendMail(message);
  };

  await sendMessage(mailOptions);
};

export default sendEmail;
