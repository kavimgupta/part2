const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    total_spend: Number,
    last_visit_date: Date,
    visit_count: Number,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
