const { Pool } = require('pg');

// Conexión dinámica usando las variables de entorno de tu Docker actual
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  max: 150, // Elevamos el pool para poder saturar los procesos de Postgres
  idleTimeoutMillis: 1000
});

// Arreglo global para simular una fuga pesada de memoria RAM por petición
let memoriaSaturada = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // 1. SOBRECARGA DE RAM: Guardamos basura en memoria que simula hilos pesados
  const dummyBuffer = Buffer.alloc(1024 * 1024 * 5); // 5MB por petición
  memoriaSaturada.push(dummyBuffer);

  // Limpieza parcial aleatoria para que no rompa el contenedor de inmediato
  if (memoriaSaturada.length > 80) memoriaSaturada = [];

  // 2. SOBRECARGA DE CPU: Cálculo masivo flotante de 40 millones de iteraciones
  let calculoIntenso = 0;
  for (let i = 0; i < 40000000; i++) {
    calculoIntenso += Math.sin(i) * Math.cos(i);
  }

  // 3. SOBRECARGA DE BD: Bloqueo concurrente de conexiones con retrasos forzados
  try {
    const rafagaConsultas = [];
    for (let j = 0; j < 20; j++) {
      // Inyectamos pg_sleep para dejar hilos abiertos consumiendo sockets de red
      rafagaConsultas.push(pool.query("SELECT pg_sleep(0.2), COUNT(*) FROM pg_stat_activity;"));
    }
    
    // Esperamos que todas las peticiones pesadas se resuelvan juntas
    await Promise.all(rafagaConsultas);

    res.status(200).json({
      status: "ataque_exitoso",
      detalles: "CPU y PostgreSQL llevados al límite",
      hash: calculoIntenso
    });
  } catch (error) {
    res.status(500).json({ status: "db_exhausted", error: error.message });
  }
}
