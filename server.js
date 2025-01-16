require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { body, validationResult, oneOf, check } = require("express-validator");
const sanitizeHtml = require('sanitize-html');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const helmet = require('helmet');

// Validate environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("ERROR: GMAIL_USER and GMAIL_PASS must be defined in the .env file.");
    process.exit(1);
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST']
}));
app.use(helmet());

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle email sending
app.post('/send-email',
    // using validation to verify valid inputs
    [
        body("name").notEmpty().withMessage("Name is required."),
        body("email").isEmail().withMessage("Invalid email address."),
        body("message").notEmpty().withMessage("Message cannot be empty."),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ validationErrors: errors.array() });
        }

        const { name, email, message } = req.body;

        // Sanitize inputs
        let sanitizedMessage, sanitizedName, sanitizedEmail;
        try {
            sanitizedMessage = sanitizeHtml(message, {
                allowedTags: [], // Strip all HTML tags
                allowedAttributes: {}
            });
            sanitizedName = sanitizeHtml(name, {
                allowedTags: [],
                allowedAttributes: {}
            });
            sanitizedEmail = sanitizeHtml(email, {
                allowedTags: [],
                allowedAttributes: {}
            });
        } catch (error) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        if (!sanitizedMessage || !sanitizedName || !sanitizedEmail) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Construct email content with sanitized inputs
        const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h1 style="background-color: #4caf50; color: #fff; padding: 10px; text-align: center;">
            New Message from ${sanitizedName}
        </h1>
        <p><strong>From:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p>${sanitizedMessage}</p>
        </div>
        <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
            Sent via Portfolio Contact Form
        </footer>
    </div>
`;


        try {
            // Create a transporter for sending the email
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

            // Check the request type: If it is an API request, return JSON.
            if (req.headers['content-type'] === 'application/json') {
                return res.status(200).json({ success: "Email sent successfully!" });
            }

            // Otherwise, redirect with success query parameter for browser requests
            res.redirect('/?success=true');
        } catch (error) {
            console.error("ERROR: Failed to send email:", error.message);

            // Don't expose internal error details to client
            if (req.headers['content-type'] === 'application/json') {
                return res.status(500).json({ error: "Failed to send email. Please try again later." });
            }

            // Redirect with error parameter for browser requests
            res.redirect('/?error=true');
        }
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
