const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
    srNo: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    unit: {
        type: String,
        required: true,
    },
    totalMtr: {
        type: Number,
        default: 0,
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    gstRate: {
        type: Number,
        default: 0,
    },
    gstAmount: {
        type: Number,
        default: 0,
    },
}, { _id: false });

const billSchema = new mongoose.Schema({
    billNumber: {
        type: String,
        required: true,
        unique: true,
    },
    billType: {
        type: String,
        enum: ['CHALLAN', 'INVOICE', 'QUOTATION'],
        default: 'CHALLAN',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerMobile: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    items: [billItemSchema],
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    gstTotal: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
        default: 0,
    },
    amountInWords: {
        type: String,
    },
    previousBalance: {
        type: Number,
        default: 0,
    },
    closingBalance: {
        type: Number,
        default: 0,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Partially Paid', 'Paid'],
        default: 'Unpaid',
    },
    notes: {
        type: String,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
billSchema.index({ billNumber: 1 });
billSchema.index({ customerId: 1, date: -1 });
billSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Bill', billSchema);
