const express = require('express');
const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');
// const { auth } = require('../middleware/auth'); // Optional: protect get route

const router = express.Router();

router.route('/')
    .get(getAllFeedback)
    .post(createFeedback);

module.exports = router;
