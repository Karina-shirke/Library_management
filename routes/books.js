const express = require('express');
const router = express.Router();
const booksController = require('./controllers/booksController');

// Get all books
router.get('/api/books', booksController.getAllBooks);

// Add a new book
router.post('/api/books', booksController.addBook);

// Get a specific book by ID
router.get('/api/books/:id', booksController.getBookById);

module.exports = router;
