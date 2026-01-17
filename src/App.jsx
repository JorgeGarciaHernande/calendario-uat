import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Countdown from './components/Countdown';
import {
  obtenerProximoDiaFestivo,
  obtenerProximoFinDeSemana,
  obtenerFinPeriodoEscolar,
  contarDiasHabilesClases,
  obtenerInfoProximoDiaLibre,
} from './utils/dateUtils';
import { descripcionesFestivos, diasFestivos } from './data/calendarData';

function App() {
  const [proximoFestivo, setProximoFestivo] = useState(null);
  const [proximoFinDeSemana, setProximoFinDeSemana] = useState(null);
  const [finPeriodo, setFinPeriodo] = useState(null);
  const [infoDiaLibre, setInfoDiaLibre] = useState(null);

  useEffect(() => {
    const actualizarDatos = () => {
      const ahora = new Date();

      // Próximo día festivo
      const festivo = obtenerProximoDiaFestivo(ahora);
      if (festivo) {
        const fechaStr = festivo.toISOString().split('T')[0];
        setProximoFestivo({
          fecha: festivo,
          descripcion: descripcionesFestivos[fechaStr] || 'Día libre (CCT UAT-SUTUAT)',
          diasHabiles: contarDiasHabilesClases(ahora, festivo),
        });
      }

      // Próximo fin de semana
      const finSemana = obtenerProximoFinDeSemana(ahora);
      setProximoFinDeSemana({
        fecha: finSemana,
        diasHabiles: contarDiasHabilesClases(ahora, finSemana),
      });

      // Fin de período escolar
      const fin = obtenerFinPeriodoEscolar(ahora);
      if (fin) {
        setFinPeriodo({
          ...fin,
          diasHabiles: contarDiasHabilesClases(ahora, fin.fecha),
        });
      }

      // Info día libre más cercano
      setInfoDiaLibre(obtenerInfoProximoDiaLibre());
    };

    actualizarDatos();
    const intervalo = setInterval(actualizarDatos, 60000); // Actualizar cada minuto

    return () => clearInterval(intervalo);
  }, []);

  // Calcular estadísticas del año
  const calcularEstadisticas = () => {
    const ahora = new Date();
    const finAnio = new Date(2026, 11, 31);
    const inicioAnio = new Date(2026, 0, 1);

    return {
      diasFestivosRestantes: diasFestivos.filter(f => f > ahora.toISOString().split('T')[0]).length,
      totalDiasFestivos: diasFestivos.length,
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Logo_de_la_Universidad_Aut%C3%B3noma_de_Tamaulipas.svg/1200px-Logo_de_la_Universidad_Aut%C3%B3noma_de_Tamaulipas.svg.png"
              alt="UAT Logo"
              className="w-16 h-16 object-contain"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Calendario UAT 2026
              </h1>
              <p className="text-orange-400 text-lg">Universidad Autónoma de Tamaulipas</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Temporizadores inteligentes que cuentan solo días de clases (Lunes a Jueves),
            excluyendo fines de semana, viernes, días festivos y vacaciones.
          </p>
        </header>

        {/* Estadísticas rápidas */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl px-6 py-3 text-center">
            <p className="text-3xl font-bold text-orange-400">{stats.diasFestivosRestantes}</p>
            <p className="text-xs text-gray-400">Días festivos restantes</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl px-6 py-3 text-center">
            <p className="text-3xl font-bold text-purple-400">{stats.totalDiasFestivos}</p>
            <p className="text-xs text-gray-400">Total días festivos 2026</p>
          </div>
          {infoDiaLibre && (
            <div className="bg-gray-800/50 backdrop-blur rounded-xl px-6 py-3 text-center">
              <p className="text-3xl font-bold text-green-400">{infoDiaLibre.diasHabiles}</p>
              <p className="text-xs text-gray-400">Días de clases hasta descanso</p>
            </div>
          )}
        </div>

        {/* Temporizadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Próximo día festivo */}
          {proximoFestivo && (
            <Countdown
              titulo="Próximo Día Festivo"
              fechaObjetivo={proximoFestivo.fecha}
              descripcion={proximoFestivo.descripcion}
              colorClase="bg-gradient-to-br from-orange-500 to-red-600"
              diasHabiles={proximoFestivo.diasHabiles}
              icono="🎉"
            />
          )}

          {/* Próximo fin de semana */}
          {proximoFinDeSemana && (
            <Countdown
              titulo="Próximo Fin de Semana"
              fechaObjetivo={proximoFinDeSemana.fecha}
              descripcion="Sábado"
              colorClase="bg-gradient-to-br from-blue-500 to-indigo-600"
              diasHabiles={proximoFinDeSemana.diasHabiles}
              icono="🏖️"
            />
          )}

          {/* Fin del período escolar */}
          {finPeriodo && (
            <Countdown
              titulo="Fin del Período"
              fechaObjetivo={finPeriodo.fecha}
              descripcion={finPeriodo.nombre}
              colorClase="bg-gradient-to-br from-purple-500 to-pink-600"
              diasHabiles={finPeriodo.diasHabiles}
              icono="🎓"
            />
          )}
        </div>

        {/* Información importante */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Cómo funciona el conteo
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <p className="font-semibold text-white">Se cuentan:</p>
                <p>Lunes, Martes, Miércoles y Jueves (días normales de clases)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-lg">✗</span>
              <div>
                <p className="font-semibold text-white">NO se cuentan:</p>
                <p>Viernes (solo 1 clase), Fines de semana, Días festivos, Vacaciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <Calendar />

        {/* Lista de próximos días festivos */}
        <div className="mt-10 bg-gray-800/50 backdrop-blur rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📅</span> Próximos Días Festivos
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {diasFestivos
              .filter(f => f >= new Date().toISOString().split('T')[0])
              .slice(0, 12)
              .map((fecha) => {
                const date = new Date(fecha + 'T00:00:00');
                const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
                return (
                  <div
                    key={fecha}
                    className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {date.getDate()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {date.toLocaleDateString('es-MX', opciones)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {descripcionesFestivos[fecha] || 'Día libre'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>Calendario Escolar Administrativo UAT 2026</p>
          <p className="mt-1">Verdad, Belleza, Probidad</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
