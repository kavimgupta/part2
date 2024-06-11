import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [totalSpend, setTotalSpend] = useState('');
    const [maxVisits, setMaxVisits] = useState('');
    const [notVisitedInMonths, setNotVisitedInMonths] = useState('');
    const [customers, setCustomers] = useState([]);

    const handleFilter = async () => {
        const response = await axios.post('http://localhost:5000/api/customers/filter', { // Changed port to 5000
            total_spend: totalSpend,
            max_visits: maxVisits,
            not_visited_in_months: notVisitedInMonths,
        });
        setCustomers(response.data);
    };

    return (
        <div>
            <h1>Customer Audience</h1>
            <div>
                <label>
                    Total Spend  ={'>'}
                    <input
                        type="number"
                        value={totalSpend}
                        onChange={(e) => setTotalSpend(e.target.value)}
                    />
                </label>
                <br></br>
                <br></br>
                <label>
                    Max Visits  ={'>'}
                    <input
                        type="number"
                        value={maxVisits}
                        onChange={(e) => setMaxVisits(e.target.value)}
                    />
                </label>
                <br></br>
                <br></br>
                <label>
                    Not Visited In Last Months  ={'>'}
                    <input
                        type="number"
                        value={notVisitedInMonths}
                        onChange={(e) => setNotVisitedInMonths(e.target.value)}
                    />
                </label>
                <br></br>
                <br></br>
                <br></br>
                <button onClick={handleFilter}>Filter</button>
            </div>
            <br></br>
            <h2>Filtered Customers</h2>
            <ul>
                {customers.map((customer) => (
                    <li key={customer._id}>{customer.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
