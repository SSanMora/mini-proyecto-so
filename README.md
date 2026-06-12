# Laboratorio de Telemetría y Pruebas de Carga Masiva

Este proyecto es un ecosistema multi-contenedor desarrollado sobre **Ubuntu en WSL2** utilizando **Docker Compose**. El objetivo principal es simular un entorno de alta demanda mediante un algoritmo híbrido que estresa secuencialmente el CPU/RAM de un servidor web y bombardea concurrentemente una base de datos relacional, permitiendo auditar la telemetría del sistema operativo en tiempo real.

---

## Arquitectura del Ecosistema

El laboratorio está compuesto por 6 microservicios interconectados en una red aislada:

1. **Next.js (`next-app`):** Aplicación web e interfaz visual de telemetría (administrada con **pnpm**).
2. **Node.js API (`node-app`):** Servidor de aplicaciones secundario.
3. **Nginx (`web-server`):** Servidor web para distribución de archivos estáticos.
4. **PostgreSQL (`postgres-db`):** Motor de base de datos relacional (víctima del agotamiento de conexiones).
5. **pgAdmin (`pgadmin-web`):** Administrador gráfico para la base de datos.
6. **Jupyter Lab (`jupyter-lab`):** Entorno de ciencia de datos para análisis de métricas.

---

## El Algoritmo de Sobrecarga (Estrés Técnico)

Para llevar el hardware al límite, el backend ejecuta tres acciones destructivas simuladas en una sola petición:
* **Saturación de CPU (Secuencial):** Ejecuta un bucle flotante de 40,000,000 de iteraciones trigonométricas que bloquea el hilo único de Node.js.
* **Fuga de RAM (Controlada):** Almacena buffers dinámicos de 8MB por petición para saturar la memoria y forzar el trabajo del recolector de basura (V8 Garbage Collector).
* **Agotamiento de Sockets (Concurrente):** Inyecta 25 consultas simultáneas usando `Promise.all()` hacia PostgreSQL acompañadas de `pg_sleep(0.3)`, bloqueando el pool de conexiones del sistema operativo.

---

## Guía de Implementación Paso a Paso

Sigue estos comandos en tu terminal de Ubuntu para clonar, levantar y auditar el laboratorio.

### 1. Clonar y preparar el entorno
```bash
# Entrar al directorio de tus proyectos
cd ~/proyecto-os

# Asegurar que las variables de entorno existan (crear archivo .env si es necesario)
echo "POSTGRES_USER=sam_admin" > .env
echo "POSTGRES_PASSWORD=MiClaveSegura123" >> .env
echo "POSTGRES_DB=mi_base_datos" >> .env
´´´
