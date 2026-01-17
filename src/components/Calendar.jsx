import { useState } from 'react';
import { mesesEspanol, diasSemana, diasFestivos, descripcionesFestivos, periodosVacacionales } from '../data/calendarData';
import { esFinDeSemana, esViernes, esDiaFestivo, estaEnVacaciones, formatearFecha } from '../utils/dateUtils';

const Calendar = () => {
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual] = useState(2026);

  const obtenerDiasDelMes = (mes, anio) => {
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();

    const dias = [];

    // Días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push(dia);
    }

    return dias;
  };

  const obtenerClaseDia = (dia) => {
    if (!dia) return '';

    const fecha = new Date(anioActual, mesActual, dia);
    const fechaStr = formatearFecha(fecha);
    const hoy = new Date();
    const esHoy =
      hoy.getDate() === dia &&
      hoy.getMonth() === mesActual &&
      hoy.getFullYear() === anioActual;

    let clases = 'relative p-2 text-center rounded-lg transition-all duration-200 cursor-pointer hover:scale-110 ';

    if (esHoy) {
      clases += 'ring-2 ring-yellow-400 ring-offset-2 ';
    }

    if (esDiaFestivo(fecha)) {
      clases += 'bg-orange-500 text-white font-bold shadow-lg ';
    } else if (estaEnVacaciones(fecha)) {
      clases += 'bg-purple-500 text-white ';
    } else if (esFinDeSemana(fecha)) {
      clases += 'bg-gray-700 text-gray-400 ';
    } else if (esViernes(fecha)) {
      clases += 'bg-blue-900/50 text-blue-300 ';
    } else {
      clases += 'bg-gray-800 text-white hover:bg-gray-700 ';
    }

    return clases;
  };

  const obtenerTooltip = (dia) => {
    if (!dia) return '';

    const fecha = new Date(anioActual, mesActual, dia);
    const fechaStr = formatearFecha(fecha);

    if (descripcionesFestivos[fechaStr]) {
      return descripcionesFestivos[fechaStr];
    }

    if (esDiaFestivo(fecha)) {
      return 'Día libre (CCT UAT-SUTUAT)';
    }

    if (estaEnVacaciones(fecha)) {
      const periodo = periodosVacacionales.find(
        p => fechaStr >= p.inicio && fechaStr <= p.fin
      );
      return periodo ? periodo.nombre : 'Vacaciones';
    }

    if (esViernes(fecha)) {
      return 'Viernes (no cuenta)';
    }

    return '';
  };

  const dias = obtenerDiasDelMes(mesActual, anioActual);

  return (
    <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 shadow-xl">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMesActual(m => Math.max(0, m - 1))}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          disabled={mesActual === 0}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white">
          {mesesEspanol[mesActual]} {anioActual}
        </h2>

        <button
          onClick={() => setMesActual(m => Math.min(11, m + 1))}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          disabled={mesActual === 11}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Selector rápido de meses */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {mesesEspanol.map((mes, idx) => (
          <button
            key={mes}
            onClick={() => setMesActual(idx)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              mesActual === idx
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {mes.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemana.map((dia, idx) => (
          <div
            key={dia}
            className={`text-center text-sm font-semibold py-2 ${
              idx === 0 || idx === 6 ? 'text-gray-500' : idx === 5 ? 'text-blue-400' : 'text-gray-300'
            }`}
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia, idx) => (
          <div
            key={idx}
            className={obtenerClaseDia(dia)}
            title={obtenerTooltip(dia)}
          >
            {dia}
            {dia && esDiaFestivo(new Date(anioActual, mesActual, dia)) && (
              <span className="absolute -top-1 -right-1 text-xs">

              </span>
            )}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-300">Día festivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500"></div>
          <span className="text-gray-300">Vacaciones</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-700"></div>
          <span className="text-gray-300">Fin de semana</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-900/50"></div>
          <span className="text-gray-300">Viernes</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
