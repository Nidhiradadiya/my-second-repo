const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Cheque', 'Online', 'Card', 'UPI'],
        default: 'Cash',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    referenceNumber: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
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
paymentSchema.index({ customerId: 1, paymentDate: -1 });
paymentSchema.index({ userId: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
