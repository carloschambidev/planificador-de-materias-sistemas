import { motion } from 'framer-motion';
import { CheckCircle2, Lock, PlusCircle, Trash2 } from 'lucide-react';
import { ELECTIVAS } from '../data/electivas';
import { useCorrelatividades } from '../hooks/useCorrelatividades';
import { useCarreraStore } from '../store/useCarreraStore';
import { cuentaComoRegularizada, cuentaComoAprobada } from '../types';

export function VistaElectivas() {
  const { materias, getMateriaCompleta } = useCorrelatividades();
  const estadoMaterias = useCarreraStore((s) => s.estadoMaterias);
  const asignarElectiva = useCarreraStore((s) => s.asignarElectiva);

  // Obtener slots de electivas del plan (ej. EL3, EL4, EL5)
  const slotsElectivas = materias.filter((m) => m.esElectiva);

  // Función para verificar si una electiva específica cumple sus requisitos
  const verificarRequisitos = (electivaId: string) => {
    const def = ELECTIVAS.find(e => e.id === electivaId);
    if (!def) return { habilitada: false, motivos: [] };

    const motivos: string[] = [];
    
    for (const reqId of def.regularizadasRequeridas) {
      const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
      if (!cuentaComoRegularizada(reqEstado)) {
        const reqDef = getMateriaCompleta(reqId);
        motivos.push(`${reqDef?.nombre ?? reqId} debe estar regularizada`);
      }
    }
    for (const reqId of def.aprobadasRequeridas) {
      const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
      if (!cuentaComoAprobada(reqEstado)) {
        const reqDef = getMateriaCompleta(reqId);
        motivos.push(`${reqDef?.nombre ?? reqId} debe estar aprobada`);
      }
    }
    
    return { habilitada: motivos.length === 0, motivos };
  };

  // Agrupar electivas por área
  const areas = Array.from(new Set(ELECTIVAS.map(e => e.area)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Materias Electivas
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Explora las materias optativas y asígnalas a los bloques de tu plan de estudios.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {areas.map((area) => (
          <div key={area} className="space-y-4">
            <h3 className="text-lg font-medium text-indigo-300 border-b border-gray-800 pb-2">
              {area}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ELECTIVAS.filter(e => e.area === area).map((electiva) => {
                const { habilitada, motivos } = verificarRequisitos(electiva.id);
                // Buscar si ya está asignada a algún slot
                const slotAsignado = slotsElectivas.find(s => s.estadoDinamico.electivaAsignadaId === electiva.id);

                return (
                  <div 
                    key={electiva.id} 
                    className={`p-4 rounded-xl border flex flex-col justify-between
                      ${habilitada 
                        ? 'bg-gray-900/60 border-gray-700/60' 
                        : 'bg-gray-900/30 border-gray-800/40 opacity-80'}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-100 flex-1">{electiva.nombre}</h4>
                        {slotAsignado && (
                          <span className="text-[10px] font-bold px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-md whitespace-nowrap">
                            Asignada a Nivel {slotAsignado.nivel}
                          </span>
                        )}
                      </div>
                      
                      {/* Estado y requisitos */}
                      <div className="mt-3 text-xs">
                        {habilitada ? (
                          <div className="flex items-center text-green-400 font-medium mb-2 gap-1.5">
                            <CheckCircle2 size={14} /> <span>Habilitada para cursar</span>
                          </div>
                        ) : (
                          <div className="flex items-start text-gray-500 mb-2 gap-1.5">
                            <Lock size={14} className="mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Requiere:</span>
                              <ul className="mt-1 space-y-1 pl-1">
                                {motivos.map((m, i) => <li key={i}>• {m}</li>)}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botonera de asignación */}
                    <div className="mt-4 pt-3 border-t border-gray-800/50 flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-gray-400">Asignar a:</span>
                      {slotsElectivas.map(slot => {
                        const esEsteSlot = slot.estadoDinamico.electivaAsignadaId === electiva.id;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => esEsteSlot ? asignarElectiva(slot.id, '') : asignarElectiva(slot.id, electiva.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5
                              ${esEsteSlot 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500'}`}
                          >
                            {esEsteSlot ? <Trash2 size={12} /> : <PlusCircle size={12} />}
                            {slot.nombre} (Nivel {slot.nivel})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
