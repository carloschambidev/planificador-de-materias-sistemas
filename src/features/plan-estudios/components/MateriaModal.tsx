// ============================================================
// COMPONENTE: MateriaModal
// Modal para ver y cambiar el estado de una materia
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, BookOpen, Clock, StickyNote } from 'lucide-react';
import type { MateriaCompleta, EstadoMateria } from "../../../core/types";
import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from "../../../core/types";
import { getMateriaById } from "../../../core/data/materias";
import { useCarreraStore } from "../../../core/store/useCarreraStore";

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

  const muchosRequisitos =
    motivoBloqueo.length > 5 ||
    materia.regularizadasRequeridas.length > 5 ||
    materia.aprobadasRequeridas.length > 5;

  const handleEstado = (nuevoEstado: EstadoMateria) => {
    setEstado(materia.id, nuevoEstado);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full ${muchosRequisitos ? 'max-w-3xl md:max-w-4xl' : 'max-w-md'} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-slate-100`}
          style={{
            boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${cfgActual.glowColor}`,
          }}
        >
          {/* Cabecera fija */}
          <div
            className="p-5 pb-3 border-b border-slate-800 shrink-0"
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
              {estaBloqueada ? (
                <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg w-fit text-sm font-bold mt-1">
                  <Lock size={16} />
                  <span>Bloqueada</span>
                </div>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mt-1 w-fit"
                  style={{ backgroundColor: cfgActual.color + '33', color: cfgActual.color, border: `1px solid ${cfgActual.color}55` }}
                >
                  <span>{cfgActual.icon}</span>
                  <span>{cfgActual.label}</span>
                </span>
              )}
            </div>
          </div>

          {/* Cuerpo con scroll */}
          <div className="p-5 overflow-y-auto flex flex-col gap-4">


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

            {/* Descripción e Información */}
            {materia.descripcion && (
              <div className="p-3.5 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Descripción e Información
                </p>
                <p className="text-xs leading-relaxed text-gray-200">
                  {materia.descripcion}
                </p>
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
    materia.aprobadasRequeridas.length > 0 ||
    Boolean(materia.requisitoAdicional);

  if (!tieneReqs) return null;

  return (
    <div className="bg-slate-800/20 border border-slate-700/50 p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        {materia.tituloRequisitos ?? 'Correlatividades y Requisitos'}
      </h3>
      <div className="space-y-4">
        {materia.requisitoAdicional && (
          <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/60 text-purple-200 shadow-lg shadow-purple-950/30">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
              <span>★</span> Requisito para Aprobar (Examen Final):
            </p>
            <p className="text-xs leading-relaxed font-semibold text-purple-100">
              {materia.requisitoAdicional}
            </p>
          </div>
        )}
        {materia.regularizadasRequeridas.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              Para cursar (regularizadas) ({materia.regularizadasRequeridas.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {materia.regularizadasRequeridas.map((id) => {
                const def = getMateriaById(id);
                return (
                  <span key={id} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-md text-xs font-medium">
                    {def?.nombre ?? id}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {materia.aprobadasRequeridas.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              Para cursar (aprobadas) ({materia.aprobadasRequeridas.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {materia.aprobadasRequeridas.map((id) => {
                const def = getMateriaById(id);
                return (
                  <span key={id} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-xs font-medium">
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
