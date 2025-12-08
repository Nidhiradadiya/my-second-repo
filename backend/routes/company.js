const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/company
// @desc    Get company details
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found. Please set up your company details.' });
        }

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/company
// @desc    Create or update company
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            name,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            gstNumber,
            gstEnabled,
            termsAndConditions,
        } = req.body;

        let company = await Company.findOne({ userId: req.user._id });

        if (company) {
            // Update existing company
            company.name = name || company.name;
            company.address = address !== undefined ? address : company.address;
            company.city = city !== undefined ? city : company.city;
            company.state = state !== undefined ? state : company.state;
            company.pincode = pincode !== undefined ? pincode : company.pincode;
            company.phone = phone !== undefined ? phone : company.phone;
            company.email = email !== undefined ? email : company.email;
            company.gstNumber = gstNumber !== undefined ? gstNumber : company.gstNumber;
            company.gstEnabled = gstEnabled !== undefined ? gstEnabled : company.gstEnabled;
            company.termsAndConditions = termsAndConditions || company.termsAndConditions;

            await company.save();
            res.json(company);
        } else {
            // Create new company
            company = await Company.create({
                name,
                address,
                city,
                state,
                pincode,
                phone,
                email,
                gstNumber,
                gstEnabled: gstEnabled || false,
                termsAndConditions: termsAndConditions || [],
                userId: req.user._id,
            });

            res.status(201).json(company);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/company/logo
// @desc    Upload company logo
// @access  Private
router.post('/logo', protect, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        let company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found. Please create company first.' });
        }

        // Convert buffer to base64
        company.logo = req.file.buffer.toString('base64');
        company.logoMimeType = req.file.mimetype;

        await company.save();

        res.json({
            message: 'Logo uploaded successfully',
            logo: company.logo,
            logoMimeType: company.logoMimeType,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/company/logo
// @desc    Remove company logo
// @access  Private
router.delete('/logo', protect, async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        company.logo = undefined;
        company.logoMimeType = undefined;
        await company.save();

        res.json({ message: 'Logo removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/company/signature
// @desc    Upload digital signature
// @access  Private
router.post('/signature', protect, upload.single('signature'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        let company = await Company.findOne({ userId: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found. Please create company first.' });
        }

        company.signature = req.file.buffer.toString('base64');
        await company.save();

        res.json({
            message: 'Signature uploaded successfully',
            signature: company.signature,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
