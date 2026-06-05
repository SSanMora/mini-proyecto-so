const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  max: 100 // Pool optimizado para soportar alta concurrencia en Linux
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    // 1. CPU CONTROLADO: 500,000 iteraciones para permitir velocidad sin tumbar el hilo
    let calculo = 0;
    for (let i = 0; i < 500000; i++) {
      calculo += Math.sin(i) * Math.cos(i);
    }

    // 2. BD OPTIMIZADA: Sleep corto para liberar sockets rápido
    await pool.query("SELECT pg_sleep(0.05);");

    return res.status(200).json({ status: 'success', hash: calculo });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
