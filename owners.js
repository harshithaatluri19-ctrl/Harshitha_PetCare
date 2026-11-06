
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, Email and Password are required'
            });
        }

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO owners (name, email, phone, address, password)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            name.trim(),
            email.trim(),
            phone || null,
            address || null,
            hashedPassword
        ]);

        res.status(201).json({
            success: true,
            message: 'Owner Registered Successfully!',
            owner_id: result.insertId
        });

    } catch (error) {
        console.error('Registration Error:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration Failed'
        });
    }
});

module.exports = router;
