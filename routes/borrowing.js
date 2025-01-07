const express = require('express');
const router = express.Router();
const booksController = require('./controllers/booksController');

// Book routes
router.get('/books', booksController.getAllBooks);
router.get('/books/:id', booksController.getBookById);
router.post('/books', booksController.addBook);
router.put('/books/borrow', booksController.borrowBook);   // Borrow a book
router.put('/books/return/:id', booksController.returnBook); // Return a book
router.get('/users/:id/borrow-history', booksController.getBorrowHistory); // Borrow history

module.exports = router;
