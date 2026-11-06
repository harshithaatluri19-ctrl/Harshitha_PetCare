
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Owner Login API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required'
            });
        }

        // Find owner using email
        const [owners] = await db.query(
            'SELECT * FROM owners WHERE email = ?',
            [email.trim()]
        );

        if (owners.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or Password'
            });
        }

        const owner = owners[0];

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(
            password,
            owner.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Email or Password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login Successful!',
            owner: {
                owner_id: owner.owner_id,
                name: owner.name,
                email: owner.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Login Failed'
        });
    }
});

module.exports = router;
