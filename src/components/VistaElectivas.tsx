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
    if (!def) return {
      habilitada: false,
      motivos: [],
      regularizadas: [],
      aprobadas: [],
    };

    const motivos: string[] = [];
    const regularizadas = def.regularizadasRequeridas.map((id) => getMateriaCompleta(id)?.nombre ?? id);
    const aprobadas = def.aprobadasRequeridas.map((id) => getMateriaCompleta(id)?.nombre ?? id);

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

    return {
      habilitada: motivos.length === 0,
      motivos,
      regularizadas,
      aprobadas,
    };
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
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-300 uppercase tracking-wider">
            Materias Electivas
          </h2>
          <p className="text-sm text-indigo-200 mt-1">
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
                const requisitos = verificarRequisitos(electiva.id);
                const { habilitada } = requisitos;
                const requisitosTexto = [
                  requisitos.regularizadas.length > 0 ? `Regularizadas: ${requisitos.regularizadas.join(', ')}` : '',
                  requisitos.aprobadas.length > 0 ? `Aprobadas: ${requisitos.aprobadas.join(', ')}` : '',
                ].filter(Boolean).join(' · ');
                const slotAsignado = slotsElectivas.find(s => s.estadoDinamico.electivaAsignadaId === electiva.id);

                return (
                  <div 
                    key={electiva.id} 
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all shadow-lg
                      ${habilitada 
                        ? 'bg-gradient-to-br from-gray-900/90 to-gray-800/80 border-gray-700/70 shadow-black/20' 
                        : 'bg-gray-900/35 border-gray-800/60 opacity-90'}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-indigo-300">
                              Electiva
                            </span>
                            {slotAsignado && (
                              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-900/60 text-indigo-200">
                                Asignada en Nivel {slotAsignado.nivel}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-100 leading-snug">{electiva.nombre}</h4>
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-800/70 bg-gray-950/60 p-3 mb-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                          Descripción
                        </p>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {electiva.descripcion ?? 'Materia optativa del plan de estudios.'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-800/70 bg-gray-950/50 p-3">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Requisitos
                          </p>
                          <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${habilitada ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                            {habilitada ? 'Habilitada' : 'Pendiente'}
                          </span>
                        </div>
                        {requisitos.regularizadas.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300 mb-2">
                              Para cursar (Regularizadas):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {requisitos.regularizadas.map((nombre, index) => (
                                <span key={`reg-${index}`} className="text-xs px-2 py-1 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-300">
                                  {nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {requisitos.aprobadas.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300 mb-2">
                              Para cursar (Aprobadas):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {requisitos.aprobadas.map((nombre, index) => (
                                <span key={`apr-${index}`} className="text-xs px-2 py-1 rounded-lg bg-emerald-900/30 border border-emerald-700/50 text-emerald-300">
                                  {nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {requisitos.regularizadas.length === 0 && requisitos.aprobadas.length === 0 && (
                          <p className="text-sm leading-relaxed text-gray-200">
                            No exige correlatividades adicionales.
                          </p>
                        )}
                      </div>
                    </div>

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
