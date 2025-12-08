const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
    },
    countryCode: {
        type: String,
        default: '+91',
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    gstNumber: {
        type: String,
        trim: true,
    },
    totalBills: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    totalPaid: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
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

// Create index for faster search
customerSchema.index({ name: 'text', mobile: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
