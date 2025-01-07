const express = require('express');
const router = express.Router();
const { getAllAuthors, addAuthor } = require('../controllers/authorController');

router.get('/', getAllAuthors);
router.post('/', addAuthor);

module.exports = router;