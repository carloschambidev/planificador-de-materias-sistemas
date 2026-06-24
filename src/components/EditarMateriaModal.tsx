// ============================================================
// COMPONENTE: EditarMateriaModal
// Modal para editar nombre, duración y notas de una materia
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw } from 'lucide-react';
import type { MateriaCompleta, DuracionMateria } from '../types';
import { useCarreraStore } from '../store/useCarreraStore';

interface Props {
  materia: MateriaCompleta | null;
  onClose: () => void;
}

export function EditarMateriaModal({ materia, onClose }: Props) {
  const { setNombrePersonalizado, setDuracionPersonalizada, setNotas } =
    useCarreraStore();

  const [nombre, setNombre] = useState('');
  const [duracion, setDuracion] = useState<DuracionMateria>('cuatrimestral');
  const [notas, setNotasState] = useState('');

  useEffect(() => {
    if (materia) {
      setNombre(
        materia.estadoDinamico.nombrePersonalizado ?? materia.nombre
      );
      setDuracion(
        materia.estadoDinamico.duracionPersonalizada ?? materia.duracion
      );
      setNotasState(materia.estadoDinamico.notasPersonales ?? '');
    }
  }, [materia]);

  if (!materia) return null;

  const handleSave = () => {
    const nombreOriginal = materia.nombre;
    if (nombre.trim() && nombre.trim() !== nombreOriginal) {
      setNombrePersonalizado(materia.id, nombre.trim());
    } else if (nombre.trim() === nombreOriginal) {
      setNombrePersonalizado(materia.id, '');
    }
    setDuracionPersonalizada(materia.id, duracion);
    setNotas(materia.id, notas.trim());
    onClose();
  };

  const handleReset = () => {
    setNombre(materia.nombre);
    setDuracion(materia.duracion);
    setNotasState('');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gray-900 border border-indigo-800/50 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Editar materia</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  <span className="font-mono text-indigo-400">{materia.codigo}</span>
                  {' '}· Nivel {materia.nivel}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la materia
                {materia.esElectiva && (
                  <span className="ml-2 text-xs text-purple-400 font-normal">(Electiva – editable)</span>
                )}
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Nombre de la materia"
              />
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['cuatrimestral', 'anual'] as DuracionMateria[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuracion(d)}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      duracion === d
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {d === 'cuatrimestral' ? '📅 Cuatrimestral' : '📆 Anual'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas personales */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notas personales
                <span className="ml-2 text-xs text-gray-500 font-normal">(opcional)</span>
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotasState(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                placeholder="Ej: Profesor X, horario martes 18hs, examen parcial el 15/5..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm hover:border-gray-600 hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
              Restaurar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              <Save size={14} />
              Guardar cambios
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
