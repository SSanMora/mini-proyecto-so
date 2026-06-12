"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Database, 
  HardDrive, 
  ShieldAlert, 
  Terminal as TerminalIcon,
  RefreshCw
} from 'lucide-react';

// Tipado para las métricas del sistema
interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  activeSockets: number;
}

export default function QuerysBomber() {
  const [concurrency, setConcurrency] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Estado para los tipos de ataque (Reintegrado)
  const [attackTypes, setAttackTypes] = useState({
    http: true,
    sql: true,
    io: false,
    lock: false
  });

  // Estado para el Monitor Clínico (Conexión Interna Reactiva)
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    memoryUsage: 0,
    activeSockets: 0
  });

  // Función para obtener métricas frescas del servidor (Monitor Clínico)
  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/stress');
      const data = await res.json();
      if (data.metrics) {
        setStats(data.metrics);
      }
    } catch (error) {
      console.error("Error actualizando monitor:", error);
    }
  };

  // Carga inicial de métricas
  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleBombard = async () => {
    // Verificar que al menos un ataque esté seleccionado
    const selectedTypes = Object.entries(attackTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type, _]) => type);

    if (selectedTypes.length === 0) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ SELECCIONA AL MENOS UN TIPO DE ATAQUE`, ...prev]);
      return;
    }

    setIsLoading(true);
    const newLog = `[${new Date().toLocaleTimeString()}] INICIANDO RÁFAGA DE ${concurrency} QUERYS...`;
    setLogs(prev => [newLog, ...prev]);

    try {
      const response = await fetch('/api/stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          concurrency: parseInt(concurrency),
          types: selectedTypes // Enviamos los tipos seleccionados
        }),
      });

      const data = await response.json();
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ INYECCIÓN COMPLETADA EXDOSAMENTE.`,
        ...prev
      ]);

      // ACTUALIZACIÓN AUTOMÁTICA DEL MONITOR TRAS EL ATAQUE
      // Esto cumple con tu requisito de actualizar sin recargar la página
      await fetchMetrics();

    } catch (error) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ ERROR EN EL CLÚSTER`, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (type: keyof typeof attackTypes) => {
    setAttackTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    // CAMBIADO A FONDO NEGRO ABSOLUTO
    <div style={{ backgroundColor: 'black', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER TÍTULO LIMPIO 🔥 */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#ffffff', fontSize: '3rem', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-0.05em' }}>
          🔥 QUERYS BOMBER 🔥
        </h1>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* PANEL DE CONTROL (INYECCIÓN DE ESTRÉS) */}
        <section style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '15px', border: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '20px' }}>
            <Zap size={20} />
            <h2 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Inyección de Estrés</h2>
          </div>
          
          {/* SELECCIÓN DE ATAQUES (REINTEGRADO CON ICONOS) */}
          <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'http', label: 'HTTP Flood (Red)', icon: <Activity className="text-emerald-500" /> },
              { id: 'sql', label: 'SQL Query Flood (CPU)', icon: <Database className="text-blue-500" /> },
              { id: 'io', label: 'I/O Disk Flood (Disco)', icon: <HardDrive className="text-purple-500" /> },
              { id: 'lock', label: 'Concurrencia (Lock)', icon: <ShieldAlert className="text-red-500" /> },
            ].map((attack) => (
              <label key={attack.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', backgroundColor: '#030712', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <input 
                  type="checkbox" 
                  checked={attackTypes[attack.id as keyof typeof attackTypes]}
                  onChange={() => handleCheckboxChange(attack.id as keyof typeof attackTypes)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#dc2626' }}
                />
                <span style={{ fontSize: '0.9rem', color: '#d1d5db', display: 'flex', itemsCenter: true, gap: '6px' }}>
                  {attack.icon} {attack.label}
                </span>
              </label>
            ))}
          </div>

          {/* VOLUMEN */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
              Volumen de Ráfaga (Concurrencia)
            </label>
            <select 
              value={concurrency} 
              onChange={(e) => setConcurrency(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#030712', color: '#fff', border: '1px solid #374151', borderRadius: '8px', fontSize: '1rem' }}
            >
              <option value="10">10 Peticiones</option>
              <option value="50">50 Peticiones</option>
              <option value="100">100 Peticiones</option>
              <option value="300">300 Peticiones</option>
              <option value="600">600 Peticiones (CRÍTICO)</option>
            </select>
          </div>

          {/* BOTÓN EN MAYÚSCULAS 🔥 */}
          <button 
            onClick={handleBombard} 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: isLoading ? '#374151' : '#dc2626', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '10px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              'DISPARAR QUERYS'
            )}
          </button>
        </section>

        {/* MONITOR CLÍNICO Y LOGS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* RECUADRO MÉTRICAS (MONITOR CLÍNICO) 🔥 */}
          <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '15px', border: '1px solid #1f2937' }}>
            <h2 style={{ color: '#38bdf8', marginTop: '0', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 'bold' }}>
              Monitor Clínico del Núcleo Linux (Post-Ataque)
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Uso CPU Kernel</p>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: '900', color: '#ef4444' }}>{stats.cpuUsage}%</p>
              </div>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>RAM Utilizada</p>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: '900', color: '#c084fc' }}>{stats.memoryUsage}%</p>
              </div>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sockets Activos</p>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>{stats.activeSockets}</p>
              </div>
            </div>
          </div>

          {/* TELEMETRÍA (LOGS) */}
          <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '15px', border: '1px solid #1f2937', flexGrow: 1, minHeight: '180px' }}>
            <p style={{ margin: '0 0 15px 0', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              &gt;_ Telemetría del Sistema Operativo
            </p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#34d399', maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {logs.length === 0 && <span style={{ color: '#4b5563', italic: 'true' }}>Esperando órdenes del operador...</span>}
              {logs.map((log, index) => (
                <div key={index} style={{ paddingBottom: '3px', borderBottom: '1px solid #111827' }}>{log}</div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
