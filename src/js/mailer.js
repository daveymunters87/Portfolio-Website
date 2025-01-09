require('dotenv').config();

console.log('GMAIL_USER:', process.env.GMAIL_USER); // Debugging
console.log('GMAIL_PASS:', process.env.GMAIL_PASS); // Debugging

const express = require('express');
const path = require('path');
const nodeMailer = require('nodemailer');

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("GMAIL_USER and GMAIL_PASS must be defined in the .env file.");
    process.exit(1); 
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    const html = `
        <h1>New Message from ${name}</h1>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `;

    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `Portfolio <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `New Message from ${name}`,
            html: html, 
        });

        console.log("Message sent: " + info.messageId);
        res.redirect('/'); // Redirect back to index.html
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send email.");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});