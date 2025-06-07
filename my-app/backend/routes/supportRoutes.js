const express = require('express');
const router = express.Router();
const mailService = require('../services/mailService');


//endpoint: wysłanie zgłoszenia do supportu

router.post('/', async (req, res) => {
  const { from, subject, message } = req.body;
  try {
    await mailService.sendMail({
      to: 'kubawrobel49@gmail.com',
      from: from, // Sender's email
      subject: `[Support] ${subject}`,
      text: message,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send support request' });
  }
});

module.exports = router;