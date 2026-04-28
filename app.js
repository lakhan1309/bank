const express = require('express');
const session = require('express-session');
const path = require('path');
const bankConfig = require('./bank-config.json');

const app = express();
const PORT = 3000;

// Make bank config available in all templates
app.locals.bankConfig = bankConfig;

// Hardcoded User Data
const USERS = [
    {
        username: "sarah_dev",
        password: "password123",
        name: "Sarah Jenkins",
        balance: 12450.50,
        accNum: "8823-1102-4491",
        cards: [
            { type: "Platinum Credit Card", number: "****-****-****-4521", expiry: "08/28", status: "Active" },
            { type: "Debit Card", number: "****-****-****-7890", expiry: "12/27", status: "Active" }
        ],
        fds: [
            { amount: 5000, interestRate: 7.5, maturityDate: "2027-03-15", status: "Active" },
            { amount: 10000, interestRate: 8.0, maturityDate: "2026-12-01", status: "Matured" }
        ],
        investments: [
            { type: "Mutual Funds", amount: 15000, currentValue: 18250 },
            { type: "Stocks", amount: 8000, currentValue: 9200 }
        ],
        loans: [
            { type: "Personal Loan", amount: 25000, emi: 1250, pending: 15000, status: "Active" },
            { type: "Auto Loan", amount: 40000, emi: 2000, pending: 32000, status: "Active" }
        ]
    },
    {
        username: "mike_manager",
        password: "securepassword",
        name: "Mike Ross",
        balance: 4200.00,
        accNum: "1002-9938-2210",
        cards: [
            { type: "Gold Credit Card", number: "****-****-****-3345", expiry: "05/29", status: "Active" }
        ],
        fds: [
            { amount: 20000, interestRate: 7.0, maturityDate: "2028-06-20", status: "Active" }
        ],
        investments: [
            { type: "Mutual Funds", amount: 5000, currentValue: 5800 }
        ],
        loans: [
            { type: "Home Loan", amount: 100000, emi: 5000, pending: 85000, status: "Active" }
        ]
    }
];

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'banking-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials. Please try again.' });
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.render('dashboard', { user: req.session.user });
});

app.post('/apply-loan', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    // Logic for loan submission would go here
    const { amount } = req.body;
    console.log(`Loan application received for ${req.session.user.name}: $${amount}`);
    res.send(`<script>alert("Application for $${amount} submitted successfully!"); window.location.href="/dashboard";</script>`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Banking server running at http://localhost:${PORT}`);
});