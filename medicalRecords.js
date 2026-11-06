
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ADD MEDICAL RECORD
router.post('/add', async (req, res) => {
    try {
        const {
            pet_id,
            vet_id,
            diagnosis,
            treatment,
            medicines
        } = req.body;

        if (!pet_id || !vet_id || !diagnosis || !treatment) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details'
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
            `INSERT INTO medical_records
            (pet_id, vet_id, diagnosis, treatment, medicines, record_date)
            VALUES (?, ?, ?, ?, ?, CURDATE())`,
            [
                pet_id,
                vet_id,
                diagnosis.trim(),
                treatment.trim(),
                medicines || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Medical Record Added Successfully!',
            record_id: result.insertId
        });

    } catch (error) {
        console.error('Medical Record Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Add Medical Record'
        });
    }
});


// GET MEDICAL RECORDS FOR AN OWNER
router.get('/owner/:owner_id', async (req, res) => {
    try {
        const ownerId = req.params.owner_id;

        const [records] = await db.query(
            `SELECT
                m.record_id,
                m.diagnosis,
                m.treatment,
                m.medicines,
                m.record_date,
                p.pet_name,
                v.name AS veterinarian_name
             FROM medical_records m
             JOIN pets p ON m.pet_id = p.pet_id
             JOIN veterinarians v ON m.vet_id = v.vet_id
             WHERE p.owner_id = ?
             ORDER BY m.record_date DESC`,
            [ownerId]
        );

        res.json({
            success: true,
            records: records
        });

    } catch (error) {
        console.error('Fetch Medical Records Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Fetch Medical Records'
        });
    }
});

module.exports = router;
