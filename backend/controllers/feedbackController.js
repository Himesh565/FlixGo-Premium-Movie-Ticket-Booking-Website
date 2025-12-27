const Feedback = require('../models/Feedback');

// Create new feedback
exports.createFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            feedback
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
