const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/latest', verifyToken, async (req, res) => {
  console.log('[SENSOR] get latest:', req.user.username);
  try {
    const [rows] = await pool.query(
      'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    const row = rows[0];
    const good = row.kualitas_baik ?? 0;
    const bad = Math.max(0, 100 - good);

    res.json({ ...row, kualitas_baik: good, kualitas_buruk: bad });
  } catch (err) {
    console.log('[SENSOR] error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  console.log('[SENSOR] get history:', req.user.username);
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(
      'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    const formatted = rows.reverse().map(row => {
      const good = row.kualitas_baik ?? 0;
      const bad = Math.max(0, 100 - good);
      const d = new Date(row.created_at);
      return {
        id: row.id,
        hari: `${d.getDate()}/${d.getMonth() + 1}`,
        good,
        bad,
        suhu: row.suhu,
        kelembapan: row.kelembapan,
        total_panen: row.total_panen,
        created_at: row.created_at,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.log('[SENSOR] history error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;