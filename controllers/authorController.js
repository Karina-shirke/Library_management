const pool = require('../config/db');

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const [authors] = await pool.query('SELECT * FROM authors');
    res.json(authors);
  } catch (err) {
    console.error('Error fetching authors:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

// Add an author
exports.addAuthor = async (req, res) => {
  const { name, bio } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO authors (name, bio) VALUES (?, ?)',
      [name, bio || null]
    );
    res.status(201).json({ id: result.insertId, name, bio });
  } catch (err) {
    console.error('Error adding author:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};
