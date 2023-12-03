var fs = require('fs'); //used for reading files
const express = require('express'); //used for Express Server
const app = express();
const port = 8080; // Use a single port for the server
const nodemailer = require('nodemailer'); //used for sending emails
const bodyParser = require('body-parser');

//File Handling
fs.readFile('./emails.txt','utf-8',function(err, data){
    if(err){
        console.error("Error Occured: ", err);
        return;
    }
    console.log('File Content:\n',data);
    return;
})

app.use(bodyParser.json());

// Define the email transport configuration (use your email service's SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'ismailshah@123',
        pass: 'ismail123'
    }
});

// Read and display email content
app.get('/emails', (req, res) => {
    fs.readFile('./emails.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).write('Error reading the file');
            return;
        }
        res.write(`<html><body><h2>Email Content</h2></h1><pre>${data}</pre></body></html>`);
        res.end();
    });
});

// Route to send the email
// Define a route to send the email
app.get('/send-email', (req, res) => {
    // Read the contents of the emails.txt file
    fs.readFile('emails.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading emails.txt:', err);
            res.json({ success: false });
        } else {
            // Compose and send the email
            const mailOptions = {
                from: 'ismailshah@gmail.com',
                to: 'alimalik@gmail.com', // Replace with the recipient's email address
                subject: 'Read data from the Text file',
                text: data
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.json({ success: false });
                } else {
                    console.log('Email sent:', info.response);
                    res.json({ success: true });
                }
            });
        }
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/emails`);
    console.log(`Server running at http://localhost:${port}/send-email`);
});
