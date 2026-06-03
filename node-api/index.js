const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a PostgreSQL usando variables de entorno de Docker
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: "success",
      message: "¡Hola Sam! API Node.js conectada a PostgreSQL de forma exitosa.",
      db_time: dbRes.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Aplicación corriendo en http://localhost:${port}`);
});
