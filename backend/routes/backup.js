const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');

// @route   GET /api/backup
// @desc    Download full database backup
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const [users, company, customers, products, bills, payments] = await Promise.all([
            User.find({}),
            Company.find({}),
            Customer.find({}),
            Product.find({}),
            Bill.find({}),
            Payment.find({})
        ]);

        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                users,
                company,
                customers,
                products,
                bills,
                payments
            }
        };

        const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        // Pretty print JSON with 2 spaces
        res.send(JSON.stringify(backupData, null, 2));

    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ message: 'Backup failed', error: error.message });
    }
});

module.exports = router;
