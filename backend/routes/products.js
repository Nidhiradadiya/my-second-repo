const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Private  
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 100, search, active = 'true' } = req.query;

        let query = { userId: req.user._id };

        if (active === 'true') {
            query.isActive = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .sort({ name: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/search
// @desc    Search products (for autocomplete)
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json([]);
        }

        const products = await Product.find({
            userId: req.user._id,
            isActive: true,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ],
        })
            .select('name unit defaultPrice gstRate')
            .limit(10);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, unit, defaultPrice, gstRate, description, companyId } = req.body;

        if (!name || defaultPrice === undefined) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await Product.create({
            name,
            unit: unit || 'Pcs',
            defaultPrice,
            gstRate: gstRate || 0,
            description,
            companyId,
            userId: req.user._id,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, unit, defaultPrice, gstRate, description, isActive } = req.body;

        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (name) product.name = name;
        if (unit) product.unit = unit;
        if (defaultPrice !== undefined) product.defaultPrice = defaultPrice;
        if (gstRate !== undefined) product.gstRate = gstRate;
        if (description !== undefined) product.description = description;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Soft delete - just mark as inactive
        product.isActive = false;
        await product.save();

        res.json({ message: 'Product deactivated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
