const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const total = await Customer.countDocuments({ userId: req.user._id });
        res.json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 50, search } = req.query;

        let query = { userId: req.user._id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
            ];
        }

        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Customer.countDocuments(query);

        res.json({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/customers/search
// @desc    Search customers (for autocomplete)
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json([]);
        }

        const customers = await Customer.find({
            userId: req.user._id,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { mobile: { $regex: q, $options: 'i' } },
            ],
        })
            .select('name mobile countryCode balance')
            .limit(10);

        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/customers
// @desc    Create customer
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, mobile, countryCode, address, gstNumber, companyId } = req.body;

        if (!name || !mobile) {
            return res.status(400).json({ message: 'Name and mobile are required' });
        }

        // Check if customer with same mobile already exists
        const existingCustomer = await Customer.findOne({
            userId: req.user._id,
            mobile,
        });

        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this mobile number already exists' });
        }

        const customer = await Customer.create({
            name,
            mobile,
            countryCode: countryCode || '+91',
            address,
            gstNumber,
            companyId,
            userId: req.user._id,
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, mobile, countryCode, address, gstNumber } = req.body;

        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (name) customer.name = name;
        if (mobile) customer.mobile = mobile;
        if (countryCode !== undefined) customer.countryCode = countryCode;
        if (address !== undefined) customer.address = address;
        if (gstNumber !== undefined) customer.gstNumber = gstNumber;

        await customer.save();

        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check if customer has bills
        const billCount = await Bill.countDocuments({ customerId: customer._id });

        if (billCount > 0) {
            return res.status(400).json({
                message: `Cannot delete customer with ${billCount} existing bills`
            });
        }

        await customer.deleteOne();

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/customers/:id/ledger
// @desc    Get customer ledger (bills and payments)
// @access  Private
router.get('/:id/ledger', protect, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const bills = await Bill.find({ customerId: customer._id })
            .sort({ date: -1 })
            .select('billNumber date total previousBalance closingBalance');

        const payments = await Payment.find({ customerId: customer._id })
            .sort({ paymentDate: -1 })
            .select('amount paymentDate paymentMode referenceNumber notes');

        // Combine and sort by date
        const ledger = [
            ...bills.map(bill => ({
                type: 'bill',
                date: bill.date,
                billNumber: bill.billNumber,
                debit: bill.total,
                credit: 0,
                balance: bill.closingBalance,
                _id: bill._id,
            })),
            ...payments.map(payment => ({
                type: 'payment',
                date: payment.paymentDate,
                paymentMode: payment.paymentMode,
                referenceNumber: payment.referenceNumber,
                notes: payment.notes,
                debit: 0,
                credit: payment.amount,
                _id: payment._id,
            })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            customer,
            ledger,
            summary: {
                totalBills: customer.totalBills,
                totalAmount: customer.totalAmount,
                totalPaid: customer.totalPaid,
                balance: customer.balance,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
