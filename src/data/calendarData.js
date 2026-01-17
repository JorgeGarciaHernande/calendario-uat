// Datos del Calendario Escolar UAT 2026
// Basado en las fechas proporcionadas por el usuario

// Días festivos oficiales (días libres) - formato: 'YYYY-MM-DD'
export const diasFestivos = [
  // Enero
  '2026-01-01', // Año Nuevo

  // Febrero
  '2026-02-02', // Día de la Constitución

  // Marzo
  '2026-03-15', // Día libre
  '2026-03-16', // Natalicio de Benito Juárez

  // Mayo
  '2026-05-01', // Día del Trabajo
  '2026-05-05', // Batalla de Puebla
  '2026-05-10', // Día de las Madres
  '2026-05-15', // Día del Maestro

  // Septiembre
  '2026-09-16', // Independencia de México

  // Octubre
  '2026-10-13', // Día libre

  // Noviembre
  '2026-11-02', // Día de Muertos
  '2026-11-16', // Revolución Mexicana
];

// Períodos vacacionales (rangos de fechas sin clases)
export const periodosVacacionales = [
  // Semana Santa: del 27 de marzo al 12 de abril (el 13 ya no es libre)
  { inicio: '2026-03-27', fin: '2026-04-12', nombre: 'Semana Santa' },

  // Vacaciones de Verano: del 22 de mayo hasta el 16 de agosto
  // (Junio y Julio no importan porque no hay clases)
  { inicio: '2026-05-22', fin: '2026-08-16', nombre: 'Vacaciones de Verano' },

  // Vacaciones de Invierno: inician el 4 de diciembre
  { inicio: '2026-12-04', fin: '2026-12-31', nombre: 'Vacaciones de Invierno' },
];

// Fechas importantes del período escolar
export const fechasEscolares = {
  // Período Primavera
  inicioPrimavera: '2026-01-12',
  finPrimavera: '2026-05-21', // Antes de vacaciones de verano

  // Período Otoño - regreso a clases el 17 de agosto
  inicioOtono: '2026-08-17',
  finOtono: '2026-12-03', // Antes de vacaciones de invierno
};

// Nombres de los meses en español
export const mesesEspanol = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Nombres de los días en español
export const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Descripciones de días festivos
export const descripcionesFestivos = {
  '2026-01-01': 'Año Nuevo',
  '2026-02-02': 'Día de la Constitución',
  '2026-03-15': 'Día libre',
  '2026-03-16': 'Natalicio de Benito Juárez',
  '2026-05-01': 'Día del Trabajo',
  '2026-05-05': 'Batalla de Puebla',
  '2026-05-10': 'Día de las Madres',
  '2026-05-15': 'Día del Maestro',
  '2026-09-16': 'Independencia de México',
  '2026-10-13': 'Día libre',
  '2026-11-02': 'Día de Muertos',
  '2026-11-16': 'Revolución Mexicana',
};
