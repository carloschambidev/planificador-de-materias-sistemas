// ============================================================
// APP PRINCIPAL – Planificador de Materias UTN FRBA
// ============================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { EstadisticasPanel } from './components/EstadisticasPanel';
import { NivelSection } from './components/NivelSection';
import { MateriaModal } from './components/MateriaModal';
import { EditarMateriaModal } from './components/EditarMateriaModal';
import { MapaCorrelatividades } from './components/MapaCorrelatividades';
import { Leyenda } from './components/Leyenda';
import { useCorrelatividades, useEstadisticas } from './hooks/useCorrelatividades';
import type { MateriaCompleta } from './types';

export default function App() {
  const { materias, getMateriaCompleta, getEstadosDisponibles } = useCorrelatividades();
  const stats = useEstadisticas(materias);

  const [vista, setVista] = useState<'plan' | 'mapa'>('plan');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaCompleta | null>(null);
  const [materiaEditar, setMateriaEditar] = useState<MateriaCompleta | null>(null);

  // Organizar materias por nivel
  const materiasPorNivel = new Map<number, MateriaCompleta[]>();
  for (const m of materias) {
    if (!materiasPorNivel.has(m.nivel)) materiasPorNivel.set(m.nivel, []);
    materiasPorNivel.get(m.nivel)!.push(m);
  }

  const handleClickMateria = (materia: MateriaCompleta) => {
    setMateriaSeleccionada(materia);
  };

  const handleEditar = () => {
    if (materiaSeleccionada) {
      setMateriaEditar(materiaSeleccionada);
      setMateriaSeleccionada(null);
    }
  };

  // Obtener versión fresca de la materia seleccionada (por si cambió el estado)
  const materiaModal = materiaSeleccionada
    ? getMateriaCompleta(materiaSeleccionada.id) ?? materiaSeleccionada
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-950/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Header vistaActual={vista} onCambiarVista={setVista} />

      {/* Main content */}
      <main className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Estadísticas siempre visibles */}
        <EstadisticasPanel stats={stats} />

        {/* Vista */}
        <AnimatePresence mode="wait">
          {vista === 'plan' ? (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Leyenda */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Plan de Estudios
                </h2>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <p className="text-xs text-gray-500 mb-2 font-medium">Leyenda de estados:</p>
                <Leyenda />
              </div>

              {/* Niveles */}
              {[1, 2, 3, 4, 5].map((nivel) => {
                const materiasNivel = materiasPorNivel.get(nivel) ?? [];
                if (materiasNivel.length === 0) return null;
                return (
                  <NivelSection
                    key={nivel}
                    nivel={nivel}
                    materias={materiasNivel}
                    onClickMateria={handleClickMateria}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="mapa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Mapa de Correlatividades
                </h2>
                <p className="text-xs text-gray-500">
                  Hacé scroll/zoom para navegar el grafo
                </p>
              </div>
              <div className="relative">
                <MapaCorrelatividades materias={materias} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-gray-600 border-t border-gray-800/50">
          UTN FRBA · Ingeniería en Sistemas de Información ·{' '}
          <span className="text-indigo-600">Planificador Personal</span>
        </footer>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {materiaModal && (
          <MateriaModal
            materia={materiaModal}
            estadosDisponibles={getEstadosDisponibles(materiaModal.id)}
            onClose={() => setMateriaSeleccionada(null)}
            onEditar={handleEditar}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {materiaEditar && (
          <EditarMateriaModal
            materia={materiaEditar}
            onClose={() => setMateriaEditar(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
