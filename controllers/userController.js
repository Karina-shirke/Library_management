const pool = require('../config/db');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};
