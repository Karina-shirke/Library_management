const express = require('express');
const cors = require('cors');

// Controllers
const { getAllAuthors, addAuthor } = require('./controllers/authorController');  
const { getAllBooks, addBook, getBookById } = require('./controllers/bookController'); 
const { getAllUsers, addUser, getUserById } = require('./controllers/userController'); 
const { borrowBook, returnBook, getBorrowHistory } = require('./controllers/borrowController'); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); // To parse JSON request bodies

// Routes for Authors
app.post('/api/authors', addAuthor);  
app.get('/api/authors', getAllAuthors);  

// Routes for Books
app.post('/api/books', addBook);  
app.get('/api/books', getAllBooks);  
app.get('/api/books/:id', getBookById); 

// Routes for Users
app.post('/api/users', addUser); 
app.get('/api/users', getAllUsers);  
app.get('/api/users/:id', getUserById);  

// Routes for Borrow Records
app.post('/api/borrow', borrowBook); 
app.put('/api/borrow/return/:id', returnBook);  
app.get('/api/borrow/history/:id', getBorrowHistory);  

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
