
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add a new pet
router.post('/add', async (req, res) => {
    try {
        const {
            owner_id,
            pet_name,
            species,
            breed,
            age,
            gender
        } = req.body;

        if (!owner_id || !pet_name || !species) {
            return res.status(400).json({
                success: false,
                message: 'Owner ID, Pet Name and Species are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO pets
            (owner_id, pet_name, species, breed, age, gender)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                owner_id,
                pet_name.trim(),
                species.trim(),
                breed || null,
                age || null,
                gender || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Pet Added Successfully!',
            pet_id: result.insertId
        });

    } catch (error) {
        console.error('Add Pet Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Add Pet'
        });
    }
});


// Get pets belonging to an owner
router.get('/:owner_id', async (req, res) => {
    try {
        const ownerId = req.params.owner_id;

        const [pets] = await db.query(
            'SELECT * FROM pets WHERE owner_id = ?',
            [ownerId]
        );

        res.json({
            success: true,
            pets: pets
        });

    } catch (error) {
        console.error('Get Pets Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to Fetch Pets'
        });
    }
});

module.exports = router;
