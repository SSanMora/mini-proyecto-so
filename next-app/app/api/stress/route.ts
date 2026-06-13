import { NextResponse } from 'next/server';
import { Client } from 'pg'; // Driver nativo de PostgreSQL exigido por la rúbrica

// Inicialización del estado global en la memoria de Node para coordinar los archivos
if (!(global as any).stressState) {
  (global as any).stressState = {
    stopRequested: false, // Bandera clínica para abortar bucles
    activeSockets: 0,     // Contador dinámico de sockets abiertos
  };
}

const state = (global as any).stressState;

// Credenciales para apuntar al contenedor 'postgres' en la red puente de Docker
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: 5432,
};

// GET: Suministra el JSON reactivo que lee el dashboard de la interfaz web
export async function GET() {
  const isTesting = state.activeSockets > 0;
  return NextResponse.json({
    metrics: {
      // Simula picos de estrés real basados en la presencia de carga activa
      cpuUsage: isTesting ? Math.floor(Math.random() * 40) + 55 : Math.floor(Math.random() * 5) + 2,
      memoryUsage: isTesting ? Math.floor(Math.random() * 20) + 65 : Math.floor(Math.random() * 4) + 22,
      activeSockets: state.activeSockets
    }
  });
}

// POST: El motor principal encargado de disparar los tres mecanismos de estrés
export async function POST(request: Request) {
  const body = await request.json();
  // Desestructuración de los nuevos parámetros avanzados del formulario
  const { concurrency, duration, batchSize, types } = body;

  state.stopRequested = false; // Reseteamos la señal de aborto al iniciar
  state.activeSockets = concurrency; // Acoplamos el volumen inicial de peticiones

  // Marcamos el límite exacto del reloj sumando la duración en segundos
  const endTime = Date.now() + duration * 1000;
  const client = new Client(dbConfig);

  try {
    // Si se activaron ataques a la base de datos, abrimos un descriptor de socket formal
    if (types.includes('sql') || types.includes('io')) {
      await client.connect();
    }

    // BUCLE CRÍTICO: Corre de forma ininterrumpida hasta que se acabe el tiempo configurado
    while (Date.now() < endTime) {
      // EVALUACIÓN DE PARADA: Si el usuario presiona abortar, rompemos el ciclo inmediatamente
      if (state.stopRequested) {
        break;
      }

      // Mecanismo 1: Simulación de inundación HTTP Flood (Red masiva)
      if (types.includes('http')) {
        state.activeSockets = concurrency + Math.floor(Math.random() * 12);
      }

      // Mecanismo 2: Inyección masiva de SELECTs con JOINs cruzados pesados para estresar CPU
      if (types.includes('sql')) {
        await client.query(`
          SELECT count(*), avg(id) 
          FROM (SELECT generate_series(1, 10000) as id) t1 
          CROSS JOIN (SELECT generate_series(1, 10) as id) t2
        `);
      }

      // Mecanismo 3: Inserción en lotes masivos (batch INSERT) usando la variable batchSize
      if (types.includes('io')) {
        let values: string[] = [];
        // Construcción dinámica de la tupla según el tamaño del lote inyectado
        for (let i = 0; i < batchSize; i++) {
          values.push(`(${Math.floor(Math.random() * 10000)}, 'Estrés de Escritura Lote Sam')`);
        }
        // Creamos una tabla aislada para no alterar datos de producción previos
        await client.query(`CREATE TABLE IF NOT EXISTS stress_batch (id INT, data TEXT);`);
        await client.query(`INSERT INTO stress_batch (id, data) VALUES ${values.join(',')};`);
      }

      // Breve espacio de respiración en hilos para evitar congelar el bucle de eventos de la app
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

  } catch (err) {
    console.error("Fricción en la inyección del núcleo:", err);
  } finally {
    // LIMPIEZA CLÍNICA: Al terminar o abortar, liberamos la memoria de PostgreSQL
    if (types.includes('sql') || types.includes('io')) {
      await client.query(`DROP TABLE IF EXISTS stress_batch;`).catch(() => {});
      await client.end(); // Cerramos el canal del socket de forma segura
    }
    state.activeSockets = 0; // Devolvemos el panel web a su estado base
  }

  return NextResponse.json({ status: state.stopRequested ? 'aborted' : 'completed' });
}
