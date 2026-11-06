
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');

const ownersRoutes = require('./routes/owners');
const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const appointmentsRoutes = require('./routes/appointments');
const medicalRecordsRoutes = require('./routes/medicalRecords');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/owners', ownersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);

// Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server Test
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Pet Care Server is working!'
    });
});

// Database Test
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT DATABASE() AS database_name'
        );

        res.json({
            success: true,
            message: 'Database Connected Successfully!',
            database: rows[0].database_name
        });

    } catch (error) {
        console.error('MySQL Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Pet Care Server running at http://localhost:${PORT}`);
});
