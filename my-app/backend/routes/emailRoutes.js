const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
//const mailService = require('../services/mailService');

router.post("/", async (req, res) => {
  const { from, subject, message } = req.body;
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kubawrobel49@gmail.com", // Your Gmail address
        pass: "ljqw metz gntk npvr", // Your Gmail password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: from,
      to: "kubawrobel49@gmail.com", // Send to yourself
      subject: `[Support] ${subject}`,
      text: message,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

router.post("/send-email", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    jerseyNumber,
    jerseyTitle,
    positions,
  } = req.body;

  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kubawrobel49@gmail.com", // Your Gmail address
        pass: "ljqw metz gntk npvr", // Your Gmail password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: "kubawrobel49@gmail.com", // Sender's email
      to: "kubawrobel49@gmail.com", // Send to yourself
      subject: "Nowe Zgloszenie do drużyny", // Subject of the email
      text: `
        Otrzymano nowe zgłoszenie do drużyny:
        ------------------------
        Imie: ${firstName} ${lastName}
        Email: ${email}
        Telefon: ${phone}
        Chciany numer: ${jerseyNumber}
        Dopisek na koszulke: ${jerseyTitle}


        Pozycje: ${positions.join(", ")}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

router.post("/send-reset", async (req, res) => {
  const { email, code } = req.body;

  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kubawrobel49@gmail.com", // Your Gmail address
        pass: "ljqw metz gntk npvr", // Your Gmail password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: "kubawrobel49@gmail.com", // Sender's email
      to: `${email}`, // Send to user
      subject: "Reset Hasla", // Subject of the email
      text: `
        ------------------------
        Oto kod do resetu hasła:
        Email: ${email}
        Kod: ${code}
        ------------------------
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
