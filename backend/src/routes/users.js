const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  console.log('[USERS] get profile:', req.user.username);

  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, role, status, dob, secret_question, secret_answer, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log('[USERS] get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile', verifyToken, async (req, res) => {
  const { username, email, dob, secretQuestion, secretAnswer, currentPassword, newPassword } = req.body;
  console.log('[USERS] update profile:', req.user.username);

  try {
    if (newPassword) {
      const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
      const match = await bcrypt.compare(currentPassword, rows[0].password);

      if (!match) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
      return res.json({ message: 'Password updated' });
    }

    const fields = [];
    const values = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }

    if (email) {
      fields.push('email = ?');
      values.push(email);
    }

    if (dob !== undefined) {
      fields.push('dob = ?');
      values.push(dob || null);
    }

    if (secretQuestion) {
      fields.push('secret_question = ?');
      values.push(secretQuestion);
    }

    if (secretAnswer) {
      fields.push('secret_answer = ?');
      values.push(secretAnswer);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.log('[USERS] update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-password', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(req.body.password, rows[0].password);

    if (!match) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    res.json({ message: 'Verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', verifyToken, requireRole('super_admin'), async (req, res) => {
  console.log('[USERS] get all users:', req.user.username);

  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending', verifyToken, requireRole('super_admin'), async (req, res) => {
  console.log('[USERS] get pending users:', req.user.username);

  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role, status, created_at FROM users WHERE status = 'pending' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', verifyToken, requireRole('super_admin'), async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  console.log('[USERS] update status:', id, status);

  if (!['active', 'inactive', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/role', verifyToken, requireRole('super_admin'), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  console.log('[USERS] update role:', id, role);

  if (!['user', 'admin', 'super_admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  console.log('[USERS] delete user:', id);

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }

  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;