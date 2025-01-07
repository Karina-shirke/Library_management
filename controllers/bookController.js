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
  const { title, author_id, published_date, genre } = req.body;

  if (!title || !author_id) {
    return res.status(400).json({ error: 'Title and AuthorId are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author_id, published_date, genre) VALUES (?, ?, ?, ?)',
      [title, author_id, published_date, genre]
    );
    res.status(201).json({ id: result.insertId, title, author_id, published_date, genre });
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
