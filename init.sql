CREATE TABLE IF NOT EXISTS historial_telemetria (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT NOW(),
    cpu_load VARCHAR(50),
    ram_usada VARCHAR(50),
    conexiones_activas INT,
    vector_ataque VARCHAR(100)
);
