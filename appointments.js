
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL VETERINARIANS
router.get('/veterinarians', async (req, res) => {
    try {
        const [vets] = await db.query(
            'SELECT * FROM veterinarians ORDER BY vet_id DESC'
        );

        res.json({
            success: true,
            veterinarians: vets
        });

    } catch (error) {
        console.error('Veterinarian Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Fetch Veterinarians'
        });
    }
});


// BOOK APPOINTMENT
router.post('/book', async (req, res) => {
    try {
        const {
            pet_id,
            vet_id,
            appointment_date,
            appointment_time,
            reason
        } = req.body;

        if (!pet_id || !vet_id || !appointment_date ||
            !appointment_time || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all appointment details'
            });
        }

        const [pets] = await db.query(
            'SELECT pet_id FROM pets WHERE pet_id = ?',
            [pet_id]
        );

        if (pets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pet Not Found'
            });
        }

        const [vets] = await db.query(
            'SELECT vet_id FROM veterinarians WHERE vet_id = ?',
            [vet_id]
        );

        if (vets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Veterinarian Not Found'
            });
        }

        const [result] = await db.query(
            `INSERT INTO appointments
            (pet_id, vet_id, appointment_date,
             appointment_time, reason, status)
            VALUES (?, ?, ?, ?, ?, 'Pending')`,
            [
                pet_id,
                vet_id,
                appointment_date,
                appointment_time,
                reason.trim()
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Appointment Booked Successfully!',
            appointment_id: result.insertId
        });

    } catch (error) {
        console.error('Booking Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Book Appointment'
        });
    }
});


// GET APPOINTMENTS FOR AN OWNER
router.get('/owner/:owner_id', async (req, res) => {
    try {
        const ownerId = req.params.owner_id;

        const [appointments] = await db.query(
            `SELECT
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status,
                p.pet_name,
                v.name AS veterinarian_name,
                v.specialization
             FROM appointments a
             JOIN pets p ON a.pet_id = p.pet_id
             JOIN veterinarians v ON a.vet_id = v.vet_id
             WHERE p.owner_id = ?
             ORDER BY a.appointment_date DESC`,
            [ownerId]
        );

        res.json({
            success: true,
            appointments: appointments
        });

    } catch (error) {
        console.error('Fetch Appointments Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Fetch Appointments'
        });
    }
});

module.exports = router;
