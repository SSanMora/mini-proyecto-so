"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Activity, Database, HardDrive, ShieldAlert, RefreshCw, Clock, Layers, AlertOctagon } from 'lucide-react';

interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  activeSockets: number;
}

export default function QuerysBomber() {
  // Parámetros obligatorios de la rúbrica
  const [concurrency, setConcurrency] = useState('10');
  const [duration, setDuration] = useState('30'); // NUEVO
  const [batchSize, setBatchSize] = useState('50'); // NUEVO
  
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [attackTypes, setAttackTypes] = useState({
    http: true,
    sql: true,
    io: false,
    lock: false
  });

  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    memoryUsage: 0,
    activeSockets: 0
  });

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/stress');
      const data = await res.json();
      if (data.metrics) setStats(data.metrics);
    } catch (error) {
      console.error("Error al obtener métricas:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBombard = async () => {
    const selectedTypes = Object.entries(attackTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type, _]) => type);

    if (selectedTypes.length === 0) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ SELECCIONA AL MENOS UN TIPO DE ATAQUE`, ...prev]);
      return;
    }

    setIsLoading(true);
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 🚀 BOMBARDEO ACTIVADO: ${concurrency} conexiones | Lotes: ${batchSize} | Duración: ${duration}s`,
      ...prev
    ]);

    try {
      const response = await fetch('/api/stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          concurrency: parseInt(concurrency),
          duration: parseInt(duration),
          batchSize: parseInt(batchSize),
          types: selectedTypes 
        }),
      });

      if (response.ok) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ INYECCIÓN COMPLETADA CON ÉXITO.`, ...prev]);
      }
    } catch (error) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ ATAQUE INTERRUMPIDO O ERROR DE RED`, ...prev]);
    } finally {
      setIsLoading(false);
      await fetchMetrics();
    }
  };

  // NUEVA FUNCIÓN: Envía la señal de parada inmediata al backend
  const handleStopAttack = async () => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🛑 DETENIENDO QUERYS...`, ...prev]);
    try {
      await fetch('/api/stress/stop', { method: 'POST' });
    } catch (error) {
      console.error("Error al detener:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#ffffff', fontSize: '3rem', fontWeight: '900', margin: '0' }}>🔥 QUERYS BOMBER 🔥</h1>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        
        <section style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '15px', border: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '20px' }}>
            <Zap size={20} />
            <h2 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Inyección de Estrés</h2>
          </div>
          
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'http', label: 'HTTP Flood (Red)', icon: <Activity style={{ color: '#10b981' }} size={16} /> },
              { id: 'sql', label: 'SQL Query Flood (CPU)', icon: <Database style={{ color: '#3b82f6' }} size={16} /> },
              { id: 'io', label: 'I/O Disk Flood (Disco)', icon: <HardDrive style={{ color: '#a855f7' }} size={16} /> },
              { id: 'lock', label: 'Concurrencia (Lock Wait)', icon: <ShieldAlert style={{ color: '#f43f5e' }} size={16} /> },
            ].map((attack) => (
              <label key={attack.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', backgroundColor: '#030712', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <input 
                  type="checkbox" 
                  checked={attackTypes[attack.id as keyof typeof attackTypes]}
                  onChange={() => setAttackTypes(prev => ({ ...prev, [attack.id]: !prev[attack.id] }))}
                  style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
                />
                <span style={{ fontSize: '0.9rem', color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {attack.icon} {attack.label}
                </span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>Número de Conexiones</label>
            <select value={concurrency} onChange={(e) => setConcurrency(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#030712', color: '#fff', border: '1px solid #374151', borderRadius: '8px' }}>
              <option value="10">10 Peticiones Simultáneas</option>
              <option value="50">50 Peticiones Simultáneas</option>
              <option value="100">100 Peticiones Simultáneas</option>
              <option value="300">300 Peticiones MÁXIMAS</option>
              <option value="600">600 Peticiones (CRÍTICO KERNEL)</option>
            </select>
          </div>

          {/* NUEVO PARAMETRO: DURACIÓN */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}><Clock size={14} /> Duración (Segundos)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="5" max="300" style={{ width: '93%', padding: '10px', backgroundColor: '#030712', color: '#fff', border: '1px solid #374151', borderRadius: '8px' }} />
          </div>

          {/* NUEVO PARAMETRO: TAMAÑO DE LOTE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#94a3b8', fontSize: '0.85rem' }}><Layers size={14} /> Tamaño del Lote (Batch Size)</label>
            <input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} min="1" max="500" style={{ width: '93%', padding: '10px', backgroundColor: '#030712', color: '#fff', border: '1px solid #374151', borderRadius: '8px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleBombard} disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: isLoading ? '#374151' : '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? 'INYECTANDO ESTRES...' : 'DISPARAR QUERYS'}
            </button>
            
            {/* NUEVO BOTÓN DE PARADA */}
            {isLoading && (
              <button onClick={handleStopAttack} style={{ width: '100%', padding: '12px', backgroundColor: '#b91c1c', color: '#fff', border: '2px solid #ef4444', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <AlertOctagon size={16} /> DETENER QUERYS
              </button>
            )}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '15px', border: '1px solid #1f2937' }}>
            <h2 style={{ color: '#38bdf8', marginTop: '0', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '20px', fontWeight: 'bold' }}>Monitor Clínico (Métricas Básicas)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem' }}>CPU %</p>
                <p style={{ margin: '0', fontSize: '2.3rem', fontWeight: '900', color: '#ef4444' }}>{stats.cpuUsage}%</p>
              </div>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem' }}>RAM %</p>
                <p style={{ margin: '0', fontSize: '2.3rem', fontWeight: '900', color: '#c084fc' }}>{stats.memoryUsage}%</p>
              </div>
              <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem' }}>Conexiones Activas</p>
                <p style={{ margin: '0', fontSize: '2.3rem', fontWeight: '900', color: 'white' }}>{stats.activeSockets}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#030712', padding: '20px', borderRadius: '15px', border: '1px solid #1f2937', flexGrow: 1, minHeight: '160px' }}>
            <p style={{ margin: '0 0 15px 0', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>&gt;_ Telemetría del Sistema Operativo</p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#34d399', maxHeight: '140px', overflowY: 'auto' }}>
              {logs.length === 0 && <span style={{ color: '#4b5563' }}>Sistema listo para la inyección...</span>}
              {logs.map((log, index) => <div key={index} style={{ paddingBottom: '3px' }}>{log}</div>)}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
