// ============================================================
// APP PRINCIPAL – Planificador de Materias UTN FRBA
// ============================================================

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './shared/components/Header';
import { EstadisticasPanel } from './shared/components/EstadisticasPanel';
import { NivelSection } from './features/plan-estudios/components/NivelSection';
import { MateriaModal } from './features/plan-estudios/components/MateriaModal';
import { EditarMateriaModal } from './features/plan-estudios/components/EditarMateriaModal';
import { MapaCorrelatividades } from './features/mapa-correlatividades/components/MapaCorrelatividades';
import { VistaElectivas } from './features/electivas/components/VistaElectivas';
import { MiPlanView } from './features/mi-plan/components/MiPlanView';
import { useCorrelatividades, useEstadisticas } from './core/hooks/useCorrelatividades';
import type { MateriaCompleta, VistaApp } from './core/types';
// No need for Download anymore since the PDF button was moved to StatsBar


const Footer = () => (
  <footer className="text-center py-4 text-xs text-muted border-t border-border mt-8">
    UTN FRBA · Ingeniería en Sistemas de Información ·{' '}
    <span className="text-blue-500">Planificador Personal</span>
  </footer>
);

export default function App() {
  const { materias, getMateriaCompleta, getEstadosDisponibles } = useCorrelatividades();
  const stats = useEstadisticas(materias);

  const [vista, setVista] = useState<VistaApp>('plan');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaCompleta | null>(null);
  const [materiaEditar, setMateriaEditar] = useState<MateriaCompleta | null>(null);

  // Memoize grouped subjects to avoid recalculating on every render
  const materiasPorNivel = useMemo(() => {
    return materias.reduce((acc, materia) => {
      const nivel = materia.nivel;
      if (!acc[nivel]) acc[nivel] = [];
      acc[nivel].push(materia);
      return acc;
    }, {} as Record<number, MateriaCompleta[]>);
  }, [materias]);

  const handleEditar = () => {
    if (materiaSeleccionada) {
      setMateriaEditar(materiaSeleccionada);
      setMateriaSeleccionada(null);
    }
  };

  // Fresh version of the selected subject
  const materiaModal = materiaSeleccionada
    ? getMateriaCompleta(materiaSeleccionada.id) ?? materiaSeleccionada
    : null;

  // Render function for clean view switching
  const renderVistaContent = () => {
    switch (vista) {
      case 'plan':
        return (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >


            {[1, 2, 3, 4, 5].map((nivel) => {
              const materiasNivel = materiasPorNivel[nivel];
              if (!materiasNivel?.length) return null;
              
              return (
                <NivelSection
                  key={nivel}
                  nivel={nivel}
                  materias={materiasNivel}
                  onClickMateria={setMateriaSeleccionada}
                />
              );
            })}
          </motion.div>
        );

      case 'mapa':
        return (
          <motion.div
            key="mapa"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hidden md:block mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wider text-center">
                Plan de Estudio 2023
              </h2>
            </div>
            <div className="relative">
              <MapaCorrelatividades materias={materias} />
            </div>
          </motion.div>
        );

      case 'electivas':
        return <VistaElectivas key="electivas" />;

      case 'mi-plan':
        return (
          <motion.div
            key="mi-plan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MiPlanView />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-[100vw] bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-50 font-sans relative transition-colors duration-300">
      
      {/* Ambient Glow (Dark Mode Only) */}
      <div className="hidden dark:block fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-700/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header vistaActual={vista} onCambiarVista={setVista} />

        <main className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
          <div className="text-center pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 md:hidden">
            {{ plan: 'Progreso', mapa: 'Plan de Estudios', electivas: 'Electivas', 'mi-plan': 'Mi Plan' }[vista]}
          </div>

          {vista === 'plan' && <EstadisticasPanel stats={stats} />}

          <AnimatePresence mode="wait">
            {renderVistaContent()}
          </AnimatePresence>

          <Footer />
        </main>

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
    </div>
  );
}
