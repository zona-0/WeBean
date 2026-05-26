const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, dob, secretQuestion, secretAnswer } = req.body;
  console.log('[AUTH] register:', username, email);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password, dob, secret_question, secret_answer, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashed, dob || null, secretQuestion || null, secretAnswer || null, 'user', 'pending']
    );

    console.log('[AUTH] register success:', username);
    res.status(201).json({ message: 'Registration successful! Your account is pending approval.' });
  } catch (err) {
    console.log('[AUTH] register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[AUTH] login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval. Please wait.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact admin.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[AUTH] login success:', user.username, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.log('[AUTH] login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-check', async (req, res) => {
  const { email } = req.body;
  console.log('[AUTH] forgot-check:', email);

  try {
    const [rows] = await pool.query('SELECT secret_question FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (!rows[0].secret_question) {
      return res.status(400).json({ message: 'No security question set' });
    }

    res.json({ secretQuestion: rows[0].secret_question });
  } catch (err) {
    console.log('[AUTH] forgot-check error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-reset', async (req, res) => {
  const { email, secretAnswer, newPassword } = req.body;
  console.log('[AUTH] forgot-reset:', email);

  try {
    const [rows] = await pool.query('SELECT secret_answer FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (rows[0].secret_answer?.toLowerCase() !== secretAnswer?.toLowerCase()) {
      return res.status(401).json({ message: 'Wrong security answer' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);

    console.log('[AUTH] password reset success:', email);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.log('[AUTH] forgot-reset error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;