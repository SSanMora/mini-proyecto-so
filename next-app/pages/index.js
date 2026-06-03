import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Listo para la prueba');
  const [loading, setLoading] = useState(false);

  const ejecutarAtaque = async () => {
    setLoading(true);
    setStatus('🔥 BOMBARDEANDO SERVIDOR Y BASE DE DATOS... ¡Mira htop en Ubuntu!');
    try {
      const res = await fetch('/api/stress');
      const data = await res.json();
      setStatus(`✅ Ataque completado. Resultado: ${data.detalles} (Hash: ${data.hash.toFixed(2)})`);
    } catch (error) {
      setStatus('❌ El servidor o la base de datos colapsaron debido al estrés.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#1a1a1a', color: '#fff', height: '100vh' }}>
      <h1 style={{ color: '#0070f3' }}>Panel de Control de Estrés - Sam</h1>
      <p style={{ fontSize: '18px' }}>Ecosistema Next.js + PostgreSQL sobre Ubuntu WSL</p>
      
      <div style={{ margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', maxWidth: '500px', backgroundColor: '#222' }}>
        <h3>Estado del Sistema:</h3>
        <p style={{ fontWeight: 'bold', color: loading ? '#ff4d4d' : '#00dfa2', fontSize: '16px' }}>{status}</p>
        
        <button 
          onClick={ejecutarAtaque} 
          disabled={loading}
          style={{
            padding: '15px 30px', fontSize: '16px', fontWeight: 'bold', backgroundColor: loading ? '#555' : '#ff4d4d',
            color: '#fff', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s'
          }}
        >
          {loading ? 'Saturando...' : 'LANZAR SOBRECARGA MASIVA 💣'}
        </button>
      </div>
      <p style={{ color: '#666', fontSize: '14px' }}>Abre una terminal con 'htop' para verificar el uso excesivo de recursos en tiempo real.</p>
    </div>
  );
}
