const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/opinions', require('./routes/opinionRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));

app.get('/', (req, res) => {
    res.send('Opinion Sharing API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
