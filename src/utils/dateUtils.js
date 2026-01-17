import { diasFestivos, periodosVacacionales } from '../data/calendarData';

/**
 * Verifica si una fecha es día festivo
 */
export const esDiaFestivo = (fecha) => {
  const fechaStr = formatearFecha(fecha);
  return diasFestivos.includes(fechaStr);
};

/**
 * Verifica si una fecha está en período vacacional
 */
export const estaEnVacaciones = (fecha) => {
  const fechaStr = formatearFecha(fecha);
  return periodosVacacionales.some(periodo => {
    return fechaStr >= periodo.inicio && fechaStr <= periodo.fin;
  });
};

/**
 * Verifica si una fecha es fin de semana (sábado o domingo)
 */
export const esFinDeSemana = (fecha) => {
  const dia = fecha.getDay();
  return dia === 0 || dia === 6; // 0 = Domingo, 6 = Sábado
};

/**
 * Verifica si una fecha es viernes
 */
export const esViernes = (fecha) => {
  return fecha.getDay() === 5;
};

/**
 * Verifica si es un día que cuenta para el usuario
 * (No es fin de semana, no es viernes, no es festivo, no es vacaciones)
 */
export const esDiaQueNoCuenta = (fecha) => {
  return esFinDeSemana(fecha) || esViernes(fecha) || esDiaFestivo(fecha) || estaEnVacaciones(fecha);
};

/**
 * Verifica si es un día hábil de clases (lunes a jueves, no festivo, no vacaciones)
 */
export const esDiaHabilClases = (fecha) => {
  const dia = fecha.getDay();
  // Lunes a Jueves (1-4), no festivo, no vacaciones
  return dia >= 1 && dia <= 4 && !esDiaFestivo(fecha) && !estaEnVacaciones(fecha);
};

/**
 * Formatea una fecha a string 'YYYY-MM-DD'
 */
export const formatearFecha = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Cuenta días hábiles de clases entre dos fechas
 * Solo cuenta lunes a jueves, excluyendo festivos y vacaciones
 */
export const contarDiasHabilesClases = (fechaInicio, fechaFin) => {
  let count = 0;
  const current = new Date(fechaInicio);
  current.setHours(0, 0, 0, 0);

  const end = new Date(fechaFin);
  end.setHours(0, 0, 0, 0);

  while (current < end) {
    if (esDiaHabilClases(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

/**
 * Obtiene el próximo día festivo desde una fecha dada
 */
export const obtenerProximoDiaFestivo = (desdeFecha = new Date()) => {
  const hoy = formatearFecha(desdeFecha);

  // Filtrar días festivos futuros y ordenar
  const festivosFuturos = diasFestivos
    .filter(fecha => fecha > hoy)
    .sort();

  if (festivosFuturos.length === 0) return null;

  return new Date(festivosFuturos[0] + 'T00:00:00');
};

/**
 * Obtiene el próximo fin de semana desde una fecha dada
 */
export const obtenerProximoFinDeSemana = (desdeFecha = new Date()) => {
  const fecha = new Date(desdeFecha);
  const diaSemana = fecha.getDay();

  // Calcular días hasta el sábado
  let diasHastaSabado;
  if (diaSemana === 6) {
    diasHastaSabado = 7; // Ya es sábado, ir al siguiente
  } else {
    diasHastaSabado = (6 - diaSemana + 7) % 7 || 7;
  }

  fecha.setDate(fecha.getDate() + diasHastaSabado);
  fecha.setHours(0, 0, 0, 0);

  return fecha;
};

/**
 * Obtiene la fecha de fin del período escolar actual o próximo
 */
export const obtenerFinPeriodoEscolar = (desdeFecha = new Date()) => {
  const hoy = formatearFecha(desdeFecha);

  const finales = [
    { fecha: '2026-05-21', nombre: 'Fin Primavera (Vacaciones de Verano)' },
    { fecha: '2026-12-03', nombre: 'Fin Otoño (Vacaciones de Invierno)' },
  ];

  const proximoFin = finales.find(f => f.fecha >= hoy);

  if (!proximoFin) return null;

  return {
    fecha: new Date(proximoFin.fecha + 'T00:00:00'),
    nombre: proximoFin.nombre,
  };
};

/**
 * Calcula el tiempo restante hasta una fecha objetivo
 * Retorna días, horas, minutos y segundos
 */
export const calcularTiempoRestante = (fechaObjetivo) => {
  const ahora = new Date();
  const diferencia = fechaObjetivo.getTime() - ahora.getTime();

  if (diferencia <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0 };
  }

  const segundos = Math.floor((diferencia / 1000) % 60);
  const minutos = Math.floor((diferencia / 1000 / 60) % 60);
  const horas = Math.floor((diferencia / 1000 / 60 / 60) % 24);
  const dias = Math.floor(diferencia / 1000 / 60 / 60 / 24);

  return { dias, horas, minutos, segundos, total: diferencia };
};

/**
 * Obtiene información completa del próximo día libre
 */
export const obtenerInfoProximoDiaLibre = () => {
  const ahora = new Date();
  const proximoFestivo = obtenerProximoDiaFestivo(ahora);
  const proximoFinDeSemana = obtenerProximoFinDeSemana(ahora);

  // Comparar cuál viene primero
  if (!proximoFestivo) {
    return {
      fecha: proximoFinDeSemana,
      tipo: 'Fin de semana',
      diasHabiles: contarDiasHabilesClases(ahora, proximoFinDeSemana),
    };
  }

  if (proximoFestivo < proximoFinDeSemana) {
    return {
      fecha: proximoFestivo,
      tipo: 'Día festivo',
      diasHabiles: contarDiasHabilesClases(ahora, proximoFestivo),
    };
  }

  return {
    fecha: proximoFinDeSemana,
    tipo: 'Fin de semana',
    diasHabiles: contarDiasHabilesClases(ahora, proximoFinDeSemana),
  };
};
