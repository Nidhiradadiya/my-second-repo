const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const { generateBillPDF } = require('../services/pdfGenerator');
const { amountToWords } = require('../services/amountToWords');

// Get next bill number
// Get next bill number
async function getNextBillNumber(userId, customerId) {
    const lastBill = await Bill.findOne({ userId })
        .sort({ createdAt: -1 })
        .collation({ locale: 'en_US' });

    if (!lastBill || !lastBill.billNumber) {
        return '1';
    }

    const lastNumber = parseInt(lastBill.billNumber);
    return String(lastNumber + 1);
}

// @route   GET /api/bills/stats
// @desc    Get bill statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const stats = await Bill.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    totalBills: { $sum: 1 }
                }
            }
        ]);

        res.json(stats[0] || { totalRevenue: 0, totalBills: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/bills
// @desc    Get all bills
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, customerId, startDate, endDate, billType } = req.query;

        let query = { userId: req.user._id };

        if (customerId) {
            query.customerId = customerId;
        }

        if (billType) {
            query.billType = billType;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const bills = await Bill.find(query)
            .populate('customerId', 'name mobile')
            .sort({ date: -1, billNumber: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Bill.countDocuments(query);

        res.json({
            bills,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/bills/:id
// @desc    Get bill by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('customerId');

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        res.json(bill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/bills
// @desc    Create new bill
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            customerId,
            billType,
            items,
            notes,
            date,
            companyId,
        } = req.body;

        if (!customerId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Customer and items are required' });
        }

        // Get customer
        const customer = await Customer.findOne({
            _id: customerId,
            userId: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Calculate totals
        let subtotal = 0;
        let gstTotal = 0;

        const processedItems = items.map((item, index) => {
            const amount = item.quantity * item.rate;
            const itemGstAmount = item.gstRate ? (amount * item.gstRate) / 100 : 0;

            subtotal += amount;
            gstTotal += itemGstAmount;

            return {
                srNo: index + 1,
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unit: item.unit,
                totalMtr: item.totalMtr || 0,
                rate: item.rate,
                amount: amount,
                gstRate: item.gstRate || 0,
                gstAmount: itemGstAmount,
            };
        });

        const total = subtotal + gstTotal;
        const previousBalance = customer.balance;
        const closingBalance = previousBalance + total;

        // Generate bill number
        const billNumber = await getNextBillNumber(req.user._id, customer._id);

        // Create bill
        const bill = await Bill.create({
            billNumber,
            billType: billType || 'CHALLAN',
            customerId: customer._id,
            customerName: customer.name,
            customerMobile: `${customer.countryCode}${customer.mobile}`,
            items: processedItems,
            subtotal,
            gstTotal,
            total,
            amountInWords: amountToWords(total),
            previousBalance,
            closingBalance,
            notes,
            date: date || Date.now(),
            companyId,
            userId: req.user._id,
        });

        // Update customer balance
        customer.totalBills += 1;
        customer.totalAmount += total;
        customer.balance = closingBalance;
        await customer.save();

        const populatedBill = await Bill.findById(bill._id).populate('customerId');

        res.status(201).json(populatedBill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/bills/:id
// @desc    Update bill
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { items, notes, billType } = req.body;

        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        const customer = await Customer.findById(bill.customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Revert previous bill amount from customer
        customer.totalAmount -= bill.total;
        customer.balance -= bill.total;

        // Recalculate if items changed
        if (items && items.length > 0) {
            let subtotal = 0;
            let gstTotal = 0;

            const processedItems = items.map((item, index) => {
                const amount = item.quantity * item.rate;
                const itemGstAmount = item.gstRate ? (amount * item.gstRate) / 100 : 0;

                subtotal += amount;
                gstTotal += itemGstAmount;

                return {
                    srNo: index + 1,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unit: item.unit,
                    totalMtr: item.totalMtr || 0,
                    rate: item.rate,
                    amount: amount,
                    gstRate: item.gstRate || 0,
                    gstAmount: itemGstAmount,
                };
            });

            const total = subtotal + gstTotal;

            bill.items = processedItems;
            bill.subtotal = subtotal;
            bill.gstTotal = gstTotal;
            bill.total = total;
            bill.closingBalance = bill.previousBalance + total;
            bill.amountInWords = amountToWords(total);

            // Update customer with new amount
            customer.totalAmount += total;
            customer.balance += total;
        }

        if (notes !== undefined) bill.notes = notes;
        if (billType) bill.billType = billType;

        await bill.save();
        await customer.save();

        const populatedBill = await Bill.findById(bill._id).populate('customerId');

        res.json(populatedBill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/bills/:id
// @desc    Delete bill
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        const customer = await Customer.findById(bill.customerId);

        if (customer) {
            // Revert customer balance
            customer.totalBills -= 1;
            customer.totalAmount -= bill.total;
            customer.balance -= bill.total;
            await customer.save();
        }

        await bill.deleteOne();

        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/bills/:id/pdf
// @desc    Download bill as PDF
// @access  Private
router.get('/:id/pdf', protect, async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('customerId');

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        const company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found. Please set up company details first.' });
        }

        // Generate PDF
        const pdfDoc = generateBillPDF(bill, company);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bill-${bill.billNumber}.pdf`);

        // Pipe PDF to response
        pdfDoc.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
