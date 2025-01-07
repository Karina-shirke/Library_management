const pool = require('../config/db');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books');
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  const { title, authorId } = req.body;

  if (!title || !authorId) {
    return res.status(400).json({ error: 'Title and AuthorId are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author_id) VALUES (?, ?)',
      [title, authorId]
    );
    res.status(201).json({ id: result.insertId, title, authorId });
  } catch (err) {
    console.error('Error adding book:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

// Get a specific book by ID
exports.getBookById = async (req, res) => {
  const bookId = req.params.id;

  try {
    const [book] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
    
    if (book.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book[0]);
  } catch (err) {
    console.error('Error fetching book by ID:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

exports.borrowBook = async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: 'UserId and BookId are required' });
  }

  try {
    // Check if the book exists and get the current borrow status
    const [book] = await pool.query('SELECT id, title, is_borrowed FROM books WHERE id = ?', [bookId]);
    
    if (book.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // If the book is borrowed, reset the status to 0 (available)
    if (book[0].is_borrowed === 1) {
      // Reset the book status to available
      await pool.query('UPDATE books SET is_borrowed = 0 WHERE id = ?', [bookId]);
      console.log(`Book ID ${bookId} was borrowed. Resetting to available.`);
    }

    // After resetting or confirming the book is available, borrow the book
    await pool.query('UPDATE books SET is_borrowed = 1 WHERE id = ?', [bookId]);

    // Check if the user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Insert a borrow record
    const [borrowRecord] = await pool.query(
      'INSERT INTO borrow_records (user_id, book_id, borrow_date) VALUES (?, ?, NOW())',
      [userId, bookId]
    );

    // Respond with the borrow record info
    res.status(201).json({ borrowRecordId: borrowRecord.insertId, userId, bookId });
  } catch (err) {
    console.error('Error borrowing book:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};


// Return a borrowed book
exports.returnBook = async (req, res) => {
  const borrowRecordId = req.params.id;

  try {
    // Check if the borrow record exists
    const [borrowRecord] = await pool.query('SELECT * FROM borrow_records WHERE id = ?', [borrowRecordId]);
    
    if (borrowRecord.length === 0) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    const bookId = borrowRecord[0].book_id;

    // Update the return_date in the borrow_records table
    await pool.query('UPDATE borrow_records SET return_date = NOW() WHERE id = ?', [borrowRecordId]);

    // Set the book as returned in the books table (reset is_borrowed to 0)
    await pool.query('UPDATE books SET is_borrowed = 0 WHERE id = ?', [bookId]);

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error('Error returning book:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};


// Get borrow history for a user
exports.getBorrowHistory = async (req, res) => {
  const userId = req.params.id;

  try {
    const [history] = await pool.query(
      'SELECT * FROM borrow_records WHERE user_id = ?',
      [userId]
    );

    if (history.length === 0) {
      return res.status(404).json({ error: 'No borrow history found for this user' });
    }

    res.json(history);
  } catch (err) {
    console.error('Error fetching borrow history:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};
