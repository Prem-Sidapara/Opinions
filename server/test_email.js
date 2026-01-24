const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function testEmail() {
    console.log('Testing Email with User:', process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from Opinions App",
            text: "If you see this, the email configuration is correct!"
        });
        console.log("✅ Email sent successfully:", info.response);
    } catch (err) {
        console.error("❌ Email Failed:", err);
    }
}

testEmail();
