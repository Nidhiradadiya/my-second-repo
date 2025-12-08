const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    pincode: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    logo: {
        type: String, // base64 encoded image
    },
    logoMimeType: {
        type: String,
    },
    gstNumber: {
        type: String,
        trim: true,
    },
    gstEnabled: {
        type: Boolean,
        default: false,
    },
    termsAndConditions: [{
        type: String,
    }],
    signature: {
        type: String, // base64 encoded signature image
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Company', companySchema);
