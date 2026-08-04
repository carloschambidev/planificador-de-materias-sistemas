// ============================================================
// COMPONENTE: MiPlanWarningModal
// Modal de advertencia para interceptar cargas horarias semanales >16hs
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  nombreMateria: string;
  horasResultantes: number;
  anio: number;
  periodo: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function MiPlanWarningModal({
  isOpen,
  nombreMateria,
  horasResultantes,
  anio,
  periodo,
  onConfirmar,
  onCancelar,
}: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="warning-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onCancelar}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md rounded-2xl border border-amber-500/50 bg-gray-900 p-6 shadow-2xl z-10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-300">
                  ⚠️ Carga Horaria Intensa
                </h3>
                <p className="text-xs text-amber-400/80">
                  Año {anio} · Período {periodo}
                </p>
              </div>
            </div>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-200 leading-relaxed font-medium">
              Al agregar <span className="font-bold text-white">"{nombreMateria}"</span>, la
              carga horaria semanal ascenderá a{' '}
              <span className="text-amber-400 font-bold">{horasResultantes} hs/semana</span> en
              este período.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 leading-relaxed">
              <span className="font-bold">Nota de Asesoramiento:</span> Si trabajas full-time
              (8hs diarias), sostener más de 16hs semanales de cursada presencial más horas de
              estudio resulta sumamente desafiante. ¿Estás seguro de agregarla de todos modos?
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancelar}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 text-gray-300 text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-900/40 transition-all"
            >
              Agregar igual
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
