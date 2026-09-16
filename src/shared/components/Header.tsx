// ============================================================
// COMPONENTE: Header
// Barra de navegación superior con logo y acciones
// ============================================================

import { useRef, ChangeEvent, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Upload,
  Trash2,
  Map,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import logoUTN from '../../../public/logo-utn-sistemas.png';
import { useCarreraStore } from "../../core/store/useCarreraStore";
import type { VistaApp } from "../../core/types";

interface Props {
  vistaActual: VistaApp;
  onCambiarVista: (vista: VistaApp) => void;
}

export function Header({ vistaActual, onCambiarVista }: Props) {
  const { exportarJSON, importarJSON, resetearTodo } =
    useCarreraStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleExportar = () => {
    const json = exportarJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utn-frba-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') importarJSON(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200">
        {/* DESKTOP NAVBAR */}
        <div className="hidden md:block max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white p-2 rounded-xl"
              >
                <img src={logoUTN} alt="UTN" className="w-full h-full object-contain filter brightness-0" />
              </motion.div>
              <div>
                <h1 className="text-base md:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">UTN FRBA</h1>
                <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-300 leading-tight">
                  Ingeniería en Sistemas
                </p>
              </div>
            </div>

            {/* Vista tabs */}
            <div className="inline-flex items-center gap-1.5">
              <TabButton
                active={vistaActual === 'plan'}
                onClick={() => onCambiarVista('plan')}
                icon={<LayoutDashboard size={14} />}
                label="Progreso"
              />
              <TabButton
                active={vistaActual === 'mapa'}
                onClick={() => onCambiarVista('mapa')}
                icon={<Map size={14} />}
                label="Plan de Estudios"
              />
              <TabButton
                active={vistaActual === 'electivas'}
                onClick={() => onCambiarVista('electivas')}
                icon={<BookOpen size={14} />}
                label="Electivas"
              />
              <TabButton
                active={vistaActual === 'mi-plan'}
                onClick={() => onCambiarVista('mi-plan')}
                icon={<Calendar size={14} />}
                label="Mi Plan"
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-1.5">
              {/* Theme Toggle */}
              <ActionButton
                onClick={() => setIsDark(!isDark)}
                icon={isDark ? <Sun size={14} /> : <Moon size={14} />}
                label=""
                title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                variant="default"
              />
              {/* Export */}
              <ActionButton
                onClick={handleExportar}
                icon={<Download size={14} />}
                label="Exportar"
                title="Exportar JSON"
                variant="default"
              />
              {/* Import */}
              <ActionButton
                onClick={() => fileInputRef.current?.click()}
                icon={<Upload size={14} />}
                label="Importar"
                title="Importar JSON"
                variant="default"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportar}
              />
              {/* Reset */}
              <ActionButton
                onClick={() => setShowResetModal(true)}
                icon={<Trash2 size={14} />}
                label=""
                title="Resetear todo"
                variant="danger"
              />
            </div>
          </div>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="md:hidden h-14 flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white p-1.5 rounded-lg">
              <img src={logoUTN} alt="UTN" className="w-full h-full object-contain filter brightness-0" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Sistemas</span>
          </div>
          
          {/* Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE MENU DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="p-4 flex flex-col gap-4">
                {/* Navigation Tabs */}
                <div className="flex flex-col gap-2">
                  <MobileTabButton
                    active={vistaActual === 'plan'}
                    onClick={() => { onCambiarVista('plan'); setIsMobileMenuOpen(false); }}
                    icon={<LayoutDashboard size={18} />}
                    label="Progreso"
                  />
                  <MobileTabButton
                    active={vistaActual === 'mapa'}
                    onClick={() => { onCambiarVista('mapa'); setIsMobileMenuOpen(false); }}
                    icon={<Map size={18} />}
                    label="Plan de Estudios"
                  />
                  <MobileTabButton
                    active={vistaActual === 'electivas'}
                    onClick={() => { onCambiarVista('electivas'); setIsMobileMenuOpen(false); }}
                    icon={<BookOpen size={18} />}
                    label="Electivas"
                  />
                  <MobileTabButton
                    active={vistaActual === 'mi-plan'}
                    onClick={() => { onCambiarVista('mi-plan'); setIsMobileMenuOpen(false); }}
                    icon={<Calendar size={18} />}
                    label="Mi Plan"
                  />
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <MobileActionButton
                    onClick={() => { setIsDark(!isDark); setIsMobileMenuOpen(false); }}
                    icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
                    label={isDark ? 'Modo Claro' : 'Modo Oscuro'}
                    variant="default"
                  />
                  <MobileActionButton
                    onClick={() => { handleExportar(); setIsMobileMenuOpen(false); }}
                    icon={<Download size={18} />}
                    label="Exportar JSON"
                    variant="default"
                  />
                  <MobileActionButton
                    onClick={() => { fileInputRef.current?.click(); setIsMobileMenuOpen(false); }}
                    icon={<Upload size={18} />}
                    label="Importar JSON"
                    variant="default"
                  />
                  <MobileActionButton
                    onClick={() => { setShowResetModal(true); setIsMobileMenuOpen(false); }}
                    icon={<Trash2 size={18} />}
                    label="Borrar Todo"
                    variant="danger"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface-elevated)] backdrop-blur-lg border border-[var(--color-border-sutil)] rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center text-center"
            >
              <div className="bg-red-500/10 text-red-400 p-4 rounded-full mb-4">
                <Trash2 size={48} />
              </div>
              
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                Borrar todo el progreso
              </h3>
              
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                ¿Estás absolutamente seguro? Esta acción eliminará permanentemente todas las materias aprobadas, regularizadas y tu plan personalizado. No se puede deshacer.
              </p>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-active)] text-[var(--color-text-primary)] border border-[var(--color-border-main)] py-2.5 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    resetearTodo();
                    setShowResetModal(false);
                  }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2.5 rounded-lg transition-colors font-medium"
                >
                  Borrar Todo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`border font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
        active
          ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/50 dark:shadow-[0_0_15px_rgba(59,130,246,0.25)]'
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-transparent dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  title,
  variant,
  loading,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  title: string;
  variant: 'default' | 'danger';
  loading?: boolean;
}) {
  const variantClasses = {
    default: 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-200 dark:hover:text-white',
    danger: 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-rose-500 hover:text-rose-600 dark:bg-slate-900/60 dark:hover:bg-rose-950/30 dark:border-slate-800 dark:hover:border-rose-500/50 dark:text-rose-400 dark:hover:text-rose-300',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      disabled={loading}
      className={`flex items-center justify-center gap-2 h-9 md:h-10 ${variant === 'danger' ? 'px-3' : (label ? 'px-3.5' : 'w-9 md:w-10')} rounded-xl text-xs md:text-sm font-medium transition-all border ${variantClasses[variant]} ${loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {label && <span className="hidden sm:inline">{label}</span>}
    </motion.button>
  );
}

function MobileTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all w-full text-left ${
        active
          ? 'bg-purple-50 text-purple-700 font-bold dark:bg-purple-500/10 dark:text-purple-300'
          : 'text-slate-600 hover:bg-slate-100 font-medium dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      <div className={`${active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function MobileActionButton({
  onClick,
  icon,
  label,
  variant,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant: 'default' | 'danger';
}) {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border-transparent',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-red-100 dark:border-red-500/20',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-colors border ${variantClasses[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}
