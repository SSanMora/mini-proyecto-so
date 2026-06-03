import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Sistema Estable - Listo para diagnóstico');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);

  const ejecutarAtaque = async () => {
    setLoading(true);
    setStatus('🔥 BOMBARDEANDO INFRAESTRUCTURA... Procesando hilos en Linux...');
    setResultados(null);
    
    try {
      const res = await fetch('/api/stress');
      const data = await res.json();
      
      if (res.ok) {
        setStatus('✅ ¡Ataque procesado con éxito! Revisa los datos de telemetría abajo.');
        setResultados(data);
      } else {
        setStatus(`❌ Error en el clúster: ${data.error}`);
      }
    } catch (error) {
      setStatus('❌ Colapso crítico del servidor web o la base de datos.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      {/* Encabezado */}
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #1e293b', paddingBottom: '20px' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '2.5rem', margin: '0' }}>📊 Dashboard Avanzado de Telemetría</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Operado por: <strong>Sam</strong> | Entorno Multi-Contenedor WSL2</p>
      </header>

      {/* Panel Central de Control */}
      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)', marginBottom: '30px' }}>
          <h3>Consola de Disparo Masivo</h3>
          <p style={{ backgroundColor: loading ? '#7f1d1d' : '#064e3b', color: loading ? '#fca5a5' : '#a7f3d0', padding: '12px', borderRadius: '6px', fontWeight: 'bold', inlineSize: 'auto' }}>
            {status}
          </p>
          
          <button 
            onClick={ejecutarAtaque} 
            disabled={loading}
            style={{
              padding: '16px 35px', fontSize: '18px', fontWeight: 'bold', backgroundColor: loading ? '#475569' : '#ef4444',
              color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)', transition: '0.2s'
            }}
          >
            {loading ? '⚡ Sfrzando Componentes...' : 'DISPARAR SOBRECARGA AL SISTEMA OPERATIVO 💣'}
          </button>
        </div>

        {/* APARTADO DE LA PANTALLA: Muestra de resultados y telemetría */}
        {resultados && (
          <div style={{ animation: 'fadeIn 0.5s', backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #374151' }}>
            <h2 style={{ color: '#10b981', marginTop: '0', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>📝 Reporte del Impacto en el Sistema</h2>
            <p><strong>Firma Matemática del CPU (Hash):</strong> <span style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{resultados.hash}</span></p>
            
            <h3 style={{ color: '#38bdf8', marginTop: '25px' }}>📈 Comparativa de Telemetría Real en Ubuntu</h3>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginTop: '15px' }}>
              {/* Columna Antes */}
              <div style={{ flex: '1', backgroundColor: '#1f2937', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🟢 Estado Inicial (Reposo)</h4>
                <p>📊 <strong>Carga CPU:</strong> {resultados.telemetria_antes.load}</p>
                <p>💾 <strong>RAM en Uso:</strong> {resultados.telemetria_antes.ramUsada} MB / {resultados.telemetria_antes.ramTotal} MB</p>
                <p>🌐 <strong>Sockets Red Activos:</strong> {resultados.telemetria_antes.conexiones}</p>
              </div>

              {/* Columna Después */}
              <div style={{ flex: '1', backgroundColor: '#1f2937', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>🔴 Estado Crítico (Bajo Ataque)</h4>
                <p>📊 <strong>Carga CPU:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{resultados.telemetria_despues.load}</span></p>
                <p>💾 <strong>RAM en Uso:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{resultados.telemetria_despues.ramUsada} MB</span> / {resultados.telemetria_despues.ramTotal} MB</p>
                <p>🌐 <strong>Sockets Red Activos:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{resultados.telemetria_despues.conexiones}</span></p>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
              *Nota: Los datos reflejan cómo el núcleo de Ubuntu WSL absorbe el impacto de las conexiones huérfanas y los hilos bloqueados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
