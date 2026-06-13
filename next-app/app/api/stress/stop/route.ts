import { NextResponse } from 'next/server';

// POST: Endpoint encargado de capturar la señal de pánico de la interfaz
export async function POST() {
  // Verificamos que el bus de memoria compartida exista en el servidor
  if ((global as any).stressState) {
    // Cambiamos el interruptor a TRUE. Esto detiene el bucle del archivo anterior al instante
    (global as any).stressState.stopRequested = true;
    // Vaciamos inmediatamente las conexiones activas registradas en la telemetría
    (global as any).stressState.activeSockets = 0;
  }
  
  // Respondemos exitosamente a la petición HTTP de Next.js
  return NextResponse.json({ success: true, message: "Señal de detención procesada." });
}
