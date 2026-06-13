# Querys Bomber - Plataforma de Inyección de Estrés y Telemetría de Sistemas Operativos

Este proyecto consiste en una plataforma web y un ecosistema distribuido diseñado para la ejecución, monitoreo y análisis de pruebas de estrés simultáneas sobre recursos del sistema operativo (CPU, memoria RAM, almacenamiento I/O y ancho de banda de red). El objetivo principal es evaluar los mecanismos de planificación del kernel de Linux, la gestión de hilos y la resiliencia de bases de datos bajo cargas de trabajo críticas.

---

## 1. Arquitectura del Sistema y Servicios

El entorno está completamente orquestado mediante contenedores Docker independientes y aislados dentro de una red interna dedicada, garantizando que el consumo de recursos sea medible y atribuible a cada componente de software.

| Contenedor | Servicio Técnico | Puerto Host | Propósito en el Ecosistema |
| :--- | :--- | :--- | :--- |
| **querys_bomber_app** | Next.js 14 (App Router) | 3001 | Interfaz gráfica de usuario y orquestador del motor de inyección de estrés. Captura la telemetría del sistema en tiempo real. |
| **postgres_db** | PostgreSQL 15 (Alpine) | 5432 | Motor de base de datos relacional que recibe las ráfagas de consultas complejas y bloqueos transaccionales. |
| **pgadmin_panel_container** | PgAdmin 4 | 5050 | Entorno de administración web para auditar el estado de las tablas, índices y sesiones activas en PostgreSQL. |
| **jupyter_notebook_container** | Jupyter Base Notebook | 8888 | Entorno analítico local aislado para el procesamiento posterior de datos y entrenamiento de modelos de optimización. |

### Infraestructura de Red y Volúmenes
* Red (cluster_network): Configurada bajo el driver bridge. Permite que los contenedores se comuniquen internamente utilizando sus nombres de servicio como DNS (ej. Next.js se conecta a la base de datos usando el host postgres en lugar de una IP estática).
* Volúmenes (pgdata): Mapeado directamente al directorio de datos de PostgreSQL en /var/lib/postgresql/data. Asegura la persistencia de los registros inyectados entre reinicios del clúster.

---

## 2. Esquema de Archivos y Organización del Proyecto

El repositorio está estructurado para separar de forma limpia el código de la aplicación web, los entornos de ejecución analíticos y los archivos de configuración de la infraestructura:

proyecto-os/
├── docker-compose.yml             # Orquestador principal de los 4 servicios de Docker
├── notebooks/                     # Directorio persistente para scripts de JupyterLab
│   └── analisis_estres.ipynb      # Notebook de análisis de métricas de hardware
└── next-app/                      # Directorio raíz del servidor web Next.js 14
    ├── Dockerfile                 # Instrucciones de compilación de la imagen web
    ├── package.json               # Dependencias de Node.js y scripts de ejecución
    ├── next.config.js             # Configuraciones nativas del framework
    └── src/
        ├── app/
            ├── layout.tsx         # Estructura global del HTML de la aplicación
            ├── page.tsx           # Vista principal de la interfaz de usuario (Dashboard)
            └── api/
                └── stress/
                    └── route.ts   # Backend encargado de ejecutar los hilos de ataque

---

## 3. Algoritmia de Sobrecarga y Parámetros de la Interfaz

El backend de la aplicación web ejecuta subprocesos orientados a saturar descriptores de archivos, sockets y ciclos de reloj del procesador. A continuación se detalla la lógica de cada ataque:

### Tipos de Inyección de Estrés

1. HTTP Flood (Red): Genera bucles asíncronos de peticiones mediante hilos paralelos dirigidos hacia los endpoints del propio servidor. Esto satura el bucle de eventos (Event Loop) de Node.js y agota los sockets de conexión disponibles en la interfaz de red virtual.
2. SQL Query Flood (CPU): Dispara ráfagas de consultas SELECT masivas y costosas a nivel computacional. El algoritmo utiliza funciones de agregación, ordenamientos complejos y funciones criptográficas (MD5) sobre tablas sin índices, forzando al planificador de consultas de PostgreSQL a ocupar el 100% de los núcleos asignados de la CPU.
3. I/O Disk Flood (Disco): Utiliza llamadas al sistema de escritura síncrona (fs.writeFileSync) para escribir bloques masivos de datos en archivos temporales dentro del contenedor, seguidos de operaciones inmediatas de eliminación (fs.unlinkSync). Esto satura el búfer de entrada/salida del almacenamiento físico.
4. Concurrencia / Lock Wait (Hilos/Memoria): Inicia transacciones simultáneas que intentan actualizar de forma masiva exactamente la misma fila dentro de la base de datos. Al no poder resolver las escrituras simultáneamente, el motor entra en un estado de contención, generando colas de espera que elevan drásticamente la latencia y la retención de memoria intermedia.

### Parámetros de Control Clínico

* Número de Conexiones: Determina la cantidad de hilos de ejecución concurrentes que se abrirán de manera simultánea. A mayor nivel de conexiones, el sistema operativo debe realizar más operaciones de cambio de contexto (Context Switching) en la CPU.
* Duración (Segundos): El tiempo total en el cual los hilos permanecerán activos enviando cargas de trabajo. Permite evaluar la estabilidad del sistema y el comportamiento térmico o de estrangulamiento (Throttling) del hardware bajo estrés sostenido.
* Tamaño del Lote (Batch Size): Define la cantidad de operaciones individuales (por ejemplo, número de queries SQL o inserciones) que se agrupan dentro de una sola transacción o paquete de red antes de ser enviados al objetivo. Impacta de forma directa el consumo de memoria RAM.

---

## 4. Guía de Implementación Paso a Paso

Para desplegar y asegurar una construcción totalmente limpia del proyecto sin conflictos de caché en el almacenamiento local de Linux, siga estrictamente esta secuencia operativa:

### Paso 1: Clonación y Ubicación
Acceda a la ruta del proyecto en su terminal de Linux:
> cd ~/proyecto-os

### Paso 2: Ejecución del Ciclo de Reinicio y Compilación Limpia
Ejecute los siguientes cuatro comandos en orden secuencial para limpiar el almacenamiento volátil y levantar los contenedores:

> docker compose down
> rm -rf next-app/.next next-app/node_modules
> docker compose build --no-cache next-app
> docker compose up -d

### Paso 3: Verificación de Estado
Confirme que los 4 contenedores estén en estado saludable (Up) y escuchando en sus puertos correspondientes:
> docker compose ps

### Paso 4: Enlaces de Acceso a las Interfaces
* Panel de Control Querys Bomber: http://localhost:3001
* Administrador de Base de Datos PgAdmin: http://localhost:5050
* Entorno Científico JupyterLab: http://localhost:8888
