const { Pool } = require('pg');
const { execSync } = require('child_process');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  max: 150,
  idleTimeoutMillis: 1000
});

// Función auxiliar para leer la telemetría nativa de Linux
function obtenerTelemetria() {
  try {
    // 1. Carga de CPU (último minuto)
    const load = execSync("cat /proc/loadavg").toString().split(" ")[0];
    // 2. Memoria RAM usada y libre (en MB)
    const memoria = execSync("free -m").toString().split("\n")[1].split(/\s+/);
    const ramUsada = memoria[2];
    const ramTotal = memoria[1];
    // 3. Conexiones de red activas en el contenedor
    const conexiones = execSync("ss -an | wc -l").toString().trim();

    return { load, ramUsada, ramTotal, conexiones };
  } catch (e) {
    return { load: "N/A", ramUsada: "N/A", ramTotal: "N/A", conexiones: "N/A" };
  }
}

let memoriaSaturada = [];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // Capturar telemetría ANTES del estrés
  const antes = obtenerTelemetria();

  // 1. SOBRECARGA DE RAM
  const dummyBuffer = Buffer.alloc(1024 * 1024 * 8); // Subimos a 8MB por petición
  memoriaSaturada.push(dummyBuffer);
  if (memoriaSaturada.length > 50) memoriaSaturada = [];

  // 2. SOBRECARGA DE CPU (40 millones de iteraciones)
  let calculoIntenso = 0;
  for (let i = 0; i < 40000000; i++) {
    calculoIntenso += Math.sin(i) * Math.cos(i);
  }

  // 3. SOBRECARGA DE BD
  try {
    const rafagaConsultas = [];
    for (let j = 0; j < 25; j++) {
      rafagaConsultas.push(pool.query("SELECT pg_sleep(0.3), COUNT(*) FROM pg_stat_activity;"));
    }
    await Promise.all(rafagaConsultas);

    // Capturar telemetría DESPUÉS del estrés
    const despues = obtenerTelemetria();

    res.status(200).json({
      status: "ataque_exitoso",
      hash: calculoIntenso,
      telemetria_antes: antes,
      telemetria_despues: despues
    });
  } catch (error) {
    res.status(500).json({ status: "db_exhausted", error: error.message });
  }
}
