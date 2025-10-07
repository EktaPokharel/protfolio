// server.js (or api/contact.js if deploying to Vercel)

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ====== Middleware ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== PostgreSQL Connection ======
const pool = new Pool({
  connectionString: process.env.DATABASE_POSTGRES_URL, // e.g. from Vercel env
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
initDB().catch(console.error);

// ====== POST /api/contact ======
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [name, email, message]
    );

    res.json({
      success: true,
      message: 'Contact saved successfully',
      contact: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save contact',
    });
  }
});

// ====== GET /api/contacts ======
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY timestamp DESC;'
    );
    res.json({ success: true, contacts: result.rows });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contacts',
    });
  }
});

// ====== GET /api/contact/:id ======
app.get('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    res.json({ success: true, contact: result.rows[0] });
  } catch (error) {
    console.error('Error retrieving contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact',
    });
  }
});

// ====== Start server (only for local dev) ======
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel (if deploying)
module.exports = app;

