const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/User');
const Contact = require('./models/Contact');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Register
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send('<h2>✅ Registered Successfully!</h2><a href="/WanderLogin.html">Login</a>');
    } catch (error) {
        res.send('<h2>❌ Registration failed!</h2>');
    }
});

// Login (Just check email & password match)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.redirect('/WanderHomePage.html');
    } else {
        res.send('<h2>❌ Invalid credentials!</h2><a href="/WanderLogin.html">Try Again</a>');
    }
});

// Contact Form
app.post('/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.send('<h2>✅ Thank you for contacting us!</h2><a href="/index.html">Back to Home</a>');
    } catch (err) {
        res.send('<h2>❌ Failed to send message!</h2>');
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
