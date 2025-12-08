const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    unit: {
        type: String,
        enum: ['Pcs', 'Mtr', 'Kg', 'Box', 'Set', 'Ltr'],
        default: 'Pcs',
    },
    defaultPrice: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    gstRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    description: {
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
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Create index for faster search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
