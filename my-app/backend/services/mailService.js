const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kubawrobel49@gmail.com", // Your Gmail address
        pass: "ljqw metz gntk npvr", // Your Gmail password or app password
      },
    });
    

/**
  Send token email for different purposes like password reset or 2FA.
  @param {string} toEmail - Recipient email address
  @param {string} token - The token to send
  @param {string} type - The type of token ('password reset' or '2FA')
 */

async function sendTokenEmail(toEmail, token, type) {
    let subject = '';
    let text = '';
    let html = '';

    if (type === 'password reset') {
        subject = 'Password Reset Token';
        text = `Your password reset token is: ${token}. It will expire in 15 minutes.`;
        html = `<p>Your password reset token is: <b>${token}</b>.</p><p>It will expire in 15 minutes.</p>`;
    } else if (type === '2FA') {
        subject = 'Two-Factor Authentication Token';
        text = `Your 2FA token is: ${token}. It will expire in 5 minutes.`;
        html = `<p>Your 2FA token is: <b>${token}</b>.</p><p>It will expire in 5 minutes.</p>`;
    } else {
        throw new Error('Invalid token type for email');
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>',
        to: toEmail,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`${type} email sent to ${toEmail}`);
    } catch (error) {
        console.error(`Error sending ${type} email:`, error);
        throw error;
    }
}

async function sendMail(mailOptions) {
    // Ensure 'from' is set (fallback if not provided)
    mailOptions.from = mailOptions.from || process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>';
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailOptions.to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


        

module.exports = {
    sendTokenEmail,
    sendMail
};
