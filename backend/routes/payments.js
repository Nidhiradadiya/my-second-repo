const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, customerId, startDate, endDate } = req.query;

        let query = { userId: req.user._id };

        if (customerId) {
            query.customerId = customerId;
        }

        if (startDate || endDate) {
            query.paymentDate = {};
            if (startDate) query.paymentDate.$gte = new Date(startDate);
            if (endDate) query.paymentDate.$lte = new Date(endDate);
        }

        const payments = await Payment.find(query)
            .populate('customerId', 'name mobile')
            .sort({ paymentDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Payment.countDocuments(query);

        res.json({
            payments,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('customerId');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/payments
// @desc    Record payment
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            customerId,
            amount,
            paymentMode,
            paymentDate,
            referenceNumber,
            notes,
            companyId,
        } = req.body;

        if (!customerId || !amount) {
            return res.status(400).json({ message: 'Customer and amount are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        const customer = await Customer.findOne({
            _id: customerId,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Create payment
        const payment = await Payment.create({
            customerId,
            amount,
            paymentMode: paymentMode || 'Cash',
            paymentDate: paymentDate || Date.now(),
            referenceNumber,
            notes,
            companyId,
            userId: req.user._id,
        });

        // Update customer balance
        customer.totalPaid += amount;
        customer.balance -= amount;
        await customer.save();

        const populatedPayment = await Payment.findById(payment._id)
            .populate('customerId');

        res.status(201).json(populatedPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/payments/:id
// @desc    Delete payment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const customer = await Customer.findById(payment.customerId);

        if (customer) {
            // Revert customer balance
            customer.totalPaid -= payment.amount;
            customer.balance += payment.amount;
            await customer.save();
        }

        await payment.deleteOne();

        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/customers/:id/payments
// @desc    Get all payments for a customer
// @access  Private
router.get('/customer/:customerId', protect, async (req, res) => {
    try {
        const payments = await Payment.find({
            customerId: req.params.customerId,
            userId: req.user._id,
        }).sort({ paymentDate: -1 });

        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
