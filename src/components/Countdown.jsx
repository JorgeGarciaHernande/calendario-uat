import { useState, useEffect } from 'react';
import { calcularTiempoRestante, contarDiasHabilesClases } from '../utils/dateUtils';

const Countdown = ({ titulo, fechaObjetivo, descripcion, colorClase, diasHabiles, icono }) => {
  const [tiempo, setTiempo] = useState(calcularTiempoRestante(fechaObjetivo));

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempoRestante(fechaObjetivo));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [fechaObjetivo]);

  const formatearNumero = (num) => String(num).padStart(2, '0');

  if (tiempo.total <= 0) {
    return (
      <div className={`rounded-2xl p-6 ${colorClase} shadow-xl`}>
        <div className="text-center text-white">
          <div className="text-4xl mb-2">{icono}</div>
          <h3 className="text-xl font-bold mb-2">{titulo}</h3>
          <p className="text-2xl font-bold">Ya llegó</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 ${colorClase} shadow-xl transform hover:scale-105 transition-all duration-300`}>
      <div className="text-center text-white">
        <div className="text-4xl mb-2">{icono}</div>
        <h3 className="text-xl font-bold mb-1">{titulo}</h3>
        <p className="text-sm opacity-90 mb-4">{descripcion}</p>

        {/* Contador de tiempo real */}
        <div className="flex justify-center gap-2 mb-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]">
            <div className="text-3xl font-bold">{tiempo.dias}</div>
            <div className="text-xs uppercase tracking-wider">Días</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]">
            <div className="text-3xl font-bold">{formatearNumero(tiempo.horas)}</div>
            <div className="text-xs uppercase tracking-wider">Horas</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]">
            <div className="text-3xl font-bold">{formatearNumero(tiempo.minutos)}</div>
            <div className="text-xs uppercase tracking-wider">Min</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]">
            <div className="text-3xl font-bold">{formatearNumero(tiempo.segundos)}</div>
            <div className="text-xs uppercase tracking-wider">Seg</div>
          </div>
        </div>

        {/* Días hábiles de clases */}
        {diasHabiles !== undefined && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-sm">
              <span className="font-bold text-2xl">{diasHabiles}</span>
              <br />
              <span className="text-xs opacity-90">días de clases restantes</span>
              <br />
              <span className="text-xs opacity-75">(Lun-Jue, sin festivos ni vacaciones)</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
