const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('./passport');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure passport with Google strategy
passport.use(new GoogleStrategy({
    clientID: '484011380831-p4d1tupugg26qs2jjqba0o5u9a0ul0n6.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback' // Adjust the callback URL as per your setup
  },
  function(accessToken, refreshToken, profile, done) {
    // You can save user profile to database or create new user here
    return done(null, profile);
  }
));


// Define the Customer schema
const customerSchema = new mongoose.Schema({
    name: String,
    total_spend: Number,
    last_visit_date: Date,
    visit_count: Number,
});

// Define the Customer model
const Customer = mongoose.model('Customer', customerSchema);

// Define the CommunicationLog schema
const communicationLogSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    message: String,
    status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' },
}, { timestamps: true });

// Define the CommunicationLog model
const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Audience', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define the API endpoints

// Define the API endpoint to fetch communication logs
app.get('/api/communication-logs', async (req, res) => {
    try {
        // Fetch communication logs from the database
        const communicationLogs = await CommunicationLog.find();

        // Send the communication logs as a JSON response
        res.json(communicationLogs);
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        console.error('Error fetching communication logs:', error);
        res.status(500).json({ error: 'An error occurred while fetching communication logs' });
    }
});


// Endpoint to filter customers based on criteria
app.post('/api/customers/filter', async (req, res) => {
    const { total_spend, max_visits, not_visited_in_months } = req.body;
    const filter = {};

    if (total_spend !== undefined) {
        filter.total_spend = { $gt: total_spend };
    }
    if (max_visits !== undefined) {
        filter.visit_count = { $lte: max_visits };
    }
    if (not_visited_in_months !== undefined) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - not_visited_in_months);
        filter.last_visit_date = { $lt: cutoffDate };
    }

    console.log('Filter:', filter); // Add this line to log the filter

    try {
        const customers = await Customer.find(filter);
        console.log('Filtered customers:', customers); // Add this line to log the results
        res.json(customers);
    } catch (err) {
        console.error('Error filtering customers:', err); // Add this line to log any errors
        res.status(500).send(err);
    }
});

// Endpoint to send personalized messages to customers
app.post('/api/send-message', async (req, res) => {
    try {
        const customers = await Customer.find();
        console.log('Customers:', customers); // Add this line to log the customers
        const personalizedMessages = customers.map(customer => ({
            customerId: customer._id,
            message: `Hi ${customer.name}, here is 10% off on your next order`
        }));

        const communicationLogs = await CommunicationLog.insertMany(personalizedMessages);
        console.log('Communication Logs:', communicationLogs); // Add this line to log the communication logs

        for (const log of communicationLogs) {
            const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
            await updateCommunicationLogStatus(log._id, deliveryStatus);
        }

        res.json({ success: true, message: 'Messages sent successfully' });
    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).json({ success: false, error: 'An error occurred while sending messages' });
    }
});

// Endpoint to simulate delivery receipt
app.post('/api/delivery-receipt', async (req, res) => {
    try {
        const { communicationLogId, status } = req.body;
        console.log('Delivery receipt for log ID:', communicationLogId, 'with status:', status); // Add this line to log the delivery receipt details

        await updateCommunicationLogStatus(communicationLogId, status);

        res.json({ success: true, message: 'Delivery receipt received successfully' });
    } catch (error) {
        console.error('Error processing delivery receipt:', error);
        res.status(500).json({ success: false, error: 'An error occurred while processing delivery receipt' });
    }
});

async function updateCommunicationLogStatus(communicationLogId, status) {
    await CommunicationLog.findByIdAndUpdate(communicationLogId, { status });
}

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
