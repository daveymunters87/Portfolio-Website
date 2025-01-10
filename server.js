require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

// Validate environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("ERROR: GMAIL_USER and GMAIL_PASS must be defined in the .env file.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle email sending
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate data
    if (!name || !email || !message) {
        console.error("ERROR: Missing required form fields.");
        return res.status(400).json({ error: "All form fields (name, email, message) are required." });
    }    

    // Construct email content
    const emailContent = `
        <h1>New Message from ${name}</h1>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `;

    try {
        // Create a transporter for sending email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        // Send the email
        const info = await transporter.sendMail({
            from: `Portfolio <${process.env.GMAIL_USER}>`, // Sender's address
            to: process.env.GMAIL_USER, // Your Gmail 
            subject: `New Message from ${name}`, // Subject
            html: emailContent, // Email content in HTML format
        });

        console.log("Message sent successfully! Message ID:", info.messageId);

        // Redirect back to the main page with a success query parameter
        res.redirect('/?success=true');
    } catch (error) {
        console.error("ERROR: Failed to send email:", error.message);
        res.status(500).send("Failed to send email. Please try again later.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
