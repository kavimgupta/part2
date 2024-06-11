const mongoose = require('mongoose');
const Customer = require('./models/customer'); // Assuming you have a customer model defined in a separate file

// Sample data to insert
const customersData = [
    { name: 'Alice', total_spend: 15000, last_visit_date: '2024-03-01', visit_count: 2 },
    { name: 'Bob', total_spend: 20000, last_visit_date: '2024-02-15', visit_count: 3 },
    { name: 'Charlie', total_spend: 12000, last_visit_date: '2023-12-01', visit_count: 3 },
    { name: 'David', total_spend: 1000, last_visit_date: '2024-06-01', visit_count: 1 },
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Audience', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');

    // Insert sample data
    return Customer.insertMany(customersData);
})
.then((result) => {
    console.log(`${result.length} documents inserted successfully`);
})
.catch((error) => {
    console.error('Error inserting data:', error);
});
