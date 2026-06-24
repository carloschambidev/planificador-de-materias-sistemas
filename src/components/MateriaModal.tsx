// ============================================================
// COMPONENTE: MateriaModal
// Modal para ver y cambiar el estado de una materia
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, BookOpen, Clock, StickyNote, AlertTriangle } from 'lucide-react';
import type { MateriaCompleta, EstadoMateria } from '../types';
import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from '../types';
import { getMateriaById } from '../data/materias';
import { useCarreraStore } from '../store/useCarreraStore';

interface Props {
  materia: MateriaCompleta | null;
  estadosDisponibles: EstadoMateria[];
  onClose: () => void;
  onEditar: () => void;
}

export function MateriaModal({ materia, estadosDisponibles, onClose, onEditar }: Props) {
  const setEstado = useCarreraStore((s) => s.setEstado);

  if (!materia) return null;

  const { estadoDinamico, estaBloqueada, motivoBloqueo } = materia;
  const estadoActual = estadoDinamico.estado;
  const cfgActual = estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[estadoActual];

  const handleEstado = (nuevoEstado: EstadoMateria) => {
    setEstado(materia.id, nuevoEstado);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-10"
          style={{
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${cfgActual.glowColor}`,
          }}
        >
          {/* Header gradient */}
          <div
            className="px-6 pt-6 pb-4"
            style={{
              background: `linear-gradient(135deg, ${cfgActual.color}22 0%, transparent 60%)`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                    {materia.codigo}
                  </span>
                  {materia.esElectiva && (
                    <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full border border-purple-700">
                      Electiva
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {materia.nombre}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {(estadoDinamico.duracionPersonalizada ?? materia.duracion) === 'anual' ? 'Anual' : 'Cuatrimestral'}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={13} />
                    Nivel {materia.nivel}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Estado actual */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: cfgActual.color + '33', color: cfgActual.color, border: `1px solid ${cfgActual.color}55` }}
              >
                <span>{cfgActual.icon}</span>
                <span>{cfgActual.label}</span>
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Bloqueo */}
            {estaBloqueada && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                <Lock size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-1">Materia bloqueada</p>
                  <ul className="space-y-1">
                    {motivoBloqueo.map((motivo, i) => (
                      <li key={i} className="text-xs text-red-400 flex items-start gap-1">
                        <span className="mt-0.5">•</span>
                        <span>{motivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Cambiar estado */}
            {!estaBloqueada && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <span>Cambiar estado</span>
                </h3>
                {estadosDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No hay transiciones disponibles desde este estado.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {estadosDisponibles.map((est) => {
                      const cfg = ESTADO_CONFIG[est];
                      return (
                        <motion.button
                          key={est}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEstado(est)}
                          className="flex items-center gap-2 p-3 rounded-xl border text-left transition-all"
                          style={{
                            backgroundColor: cfg.color + '22',
                            borderColor: cfg.color + '66',
                            color: cfg.color,
                          }}
                        >
                          <span className="text-base">{cfg.icon}</span>
                          <span className="text-sm font-medium">{cfg.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Correlatividades */}
            <CorrelativiadadesSection materia={materia} />

            {/* Notas personales */}
            {estadoDinamico.notasPersonales && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                <StickyNote size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-300">{estadoDinamico.notasPersonales}</p>
              </div>
            )}

            {/* Botón editar */}
            <button
              onClick={onEditar}
              className="w-full py-2.5 rounded-xl border border-indigo-700 bg-indigo-900/30 text-indigo-300 text-sm font-medium hover:bg-indigo-900/50 transition-colors"
            >
              ✏️ Editar materia
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CorrelativiadadesSection({ materia }: { materia: MateriaCompleta }) {
  const tieneReqs =
    materia.regularizadasRequeridas.length > 0 ||
    materia.aprobadasRequeridas.length > 0;

  if (!tieneReqs) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Correlatividades</h3>
      <div className="space-y-2">
        {materia.regularizadasRequeridas.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Para cursar (regularizadas):</p>
            <div className="flex flex-wrap gap-1.5">
              {materia.regularizadasRequeridas.map((id) => {
                const def = getMateriaById(id);
                return (
                  <span key={id} className="text-xs px-2 py-1 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-300">
                    {def?.nombre ?? id}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {materia.aprobadasRequeridas.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Para cursar (aprobadas):</p>
            <div className="flex flex-wrap gap-1.5">
              {materia.aprobadasRequeridas.map((id) => {
                const def = getMateriaById(id);
                return (
                  <span key={id} className="text-xs px-2 py-1 rounded-lg bg-green-900/30 border border-green-700/50 text-green-300">
                    {def?.nombre ?? id}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
