# Querys Bomber

## Plataforma de Inyección de Estrés y Telemetría de Sistemas Operativos

Proyecto académico desarrollado para la asignatura Sistemas Operativos de la Universidad del Valle – Sede Tuluá.

### Integrantes

* Santiago Serrano Morales – Código 2477006
* Samuel Esteban Peña Jaramillo – Código 2477399

### Profesor

Julián Enrique Castro Segura

---

## Descripción General

Este proyecto consiste en una plataforma web y un ecosistema distribuido diseñado para la ejecución, monitoreo y análisis de pruebas de estrés simultáneas sobre recursos del sistema operativo (CPU, memoria RAM, almacenamiento I/O y ancho de banda de red).

El objetivo principal es evaluar los mecanismos de planificación del kernel de Linux, la gestión de procesos e hilos, el comportamiento de los contenedores Docker y la resiliencia de bases de datos bajo cargas de trabajo críticas.

---

## Requisitos Previos

Antes de ejecutar el proyecto se requiere:

* Linux Ubuntu 22.04 o superior
* Docker Engine 24 o superior
* Docker Compose v2
* Git
* Navegador web moderno
* Mínimo 8 GB de RAM recomendados
* 10 GB de espacio libre en disco

Verificación:

```bash
docker --version
docker compose version
git --version
```

---

## Arquitectura General

```text
Usuario
   │
   ▼
Querys Bomber (Next.js)
   │
   ├── PostgreSQL
   ├── PgAdmin
   └── JupyterLab
```

---

## Arquitectura del Sistema y Servicios

| Contenedor                 | Servicio Técnico        | Puerto Host | Propósito                                                    |
| -------------------------- | ----------------------- | ----------- | ------------------------------------------------------------ |
| querys_bomber_app          | Next.js 14 (App Router) | 3001        | Interfaz gráfica de usuario y motor de inyección de estrés   |
| postgres_db                | PostgreSQL 15 (Alpine)  | 5432        | Base de datos utilizada para pruebas de carga y concurrencia |
| pgadmin_panel_container    | PgAdmin 4               | 5050        | Administración y monitoreo de PostgreSQL                     |
| jupyter_notebook_container | Jupyter Base Notebook   | 8888        | Ejecución de pruebas de inteligencia artificial y análisis   |

### Infraestructura de Red y Volúmenes

**Red (cluster_network)**

Configurada bajo el driver bridge, permitiendo la comunicación entre contenedores mediante nombres de servicio.

**Volumen (pgdata)**

Permite la persistencia de la información almacenada por PostgreSQL entre reinicios del sistema.

---

## Organización del Proyecto

```text
proyecto-os/
├── docker-compose.yml
├── notebooks/
│   └── training_ai_model.ipynb
├── next-app/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── api/
│       │       └── stress/
│       │           └── route.ts
├── vmstat_estres.txt
└── README.md
```

---

## Mecanismos de Estrés Implementados

### HTTP Flood (Red)

Genera grandes cantidades de solicitudes HTTP concurrentes hacia la aplicación, incrementando el uso de CPU y conexiones de red.

### SQL Query Flood (CPU)

Ejecuta consultas complejas sobre PostgreSQL para incrementar el consumo de CPU y evaluar el comportamiento del planificador de consultas.

### I/O Disk Flood (Disco)

Realiza escrituras y eliminaciones masivas de archivos temporales para generar carga sobre el subsistema de almacenamiento.

### Concurrencia / Lock Wait

Provoca bloqueos transaccionales mediante múltiples actualizaciones simultáneas sobre los mismos registros de base de datos.

---

## Parámetros de Configuración

### Número de Conexiones

Cantidad de procesos concurrentes utilizados durante la prueba.

### Duración

Tiempo total durante el cual se mantiene activa la carga de trabajo.

### Tamaño del Lote (Batch Size)

Cantidad de operaciones agrupadas dentro de cada ciclo de ejecución.

---

## Herramientas de Monitoreo Utilizadas

Durante las pruebas se utilizaron las siguientes herramientas:

* htop
* docker stats
* vmstat
* iostat
* pg_stat_activity
* JupyterLab

Estas herramientas permitieron analizar el comportamiento de CPU, memoria RAM, almacenamiento y concurrencia durante la ejecución de los escenarios de estrés.

---

## Guía de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SamuJaramillo/proyecto-os.git
cd proyecto-os
```

### 2. Limpiar Artefactos Previos

```bash
docker compose down
rm -rf next-app/.next
rm -rf next-app/node_modules
```

### 3. Reconstruir la Aplicación

```bash
docker compose build --no-cache next-app
```

### 4. Iniciar el Entorno

```bash
docker compose up -d
```

### 5. Verificar Contenedores

```bash
docker compose ps
```

---

## Acceso a los Servicios

| Servicio      | URL                   |
| ------------- | --------------------- |
| Querys Bomber | http://localhost:3001 |
| PgAdmin       | http://localhost:5050 |
| JupyterLab    | http://localhost:8888 |

---

## Repositorios del Proyecto

Repositorio de Santiago Serrano Morales:

https://github.com/SSanMora/mini-proyecto-so

Repositorio de Samuel Esteban Peña Jaramillo:

https://github.com/SamuJaramillo/proyecto-os

---

## Evidencias Generadas

El proyecto incluye:

* Informe técnico IEEE.
* Evidencias de monitoreo.
* Capturas de ejecución.
* Archivo vmstat_estres.txt.
* Notebook de entrenamiento de inteligencia artificial.
* Código fuente completo de la aplicación Querys Bomber.

---

## Licencia

Proyecto académico desarrollado para la asignatura Sistemas Operativos de la Universidad del Valle – Sede Tuluá.

---

## Resultados Obtenidos

Durante las pruebas se lograron ejecutar escenarios de:

- HTTP Flood
- SQL Query Flood
- I/O Disk Stress
- Concurrencia y Contención
- Entrenamiento de Inteligencia Artificial

Las métricas obtenidas fueron analizadas mediante htop, vmstat, iostat, docker stats y pg_stat_activity, permitiendo identificar cuellos de botella y evaluar el comportamiento de los recursos del sistema bajo condiciones de alta carga.
