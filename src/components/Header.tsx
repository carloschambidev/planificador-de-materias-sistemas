// ============================================================
// COMPONENTE: Header
// Barra de navegación superior con logo y acciones
// ============================================================

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Download,
  Upload,
  Cloud,
  CloudDownload,
  Trash2,
  Map,
  LayoutDashboard,
} from 'lucide-react';
import { useCarreraStore } from '../store/useCarreraStore';

interface Props {
  vistaActual: 'plan' | 'mapa';
  onCambiarVista: (vista: 'plan' | 'mapa') => void;
}

export function Header({ vistaActual, onCambiarVista }: Props) {
  const { exportarJSON, importarJSON, guardarEnDrive, cargarDesdeDrive, resetearTodo } =
    useCarreraStore();
  const [driveLoading, setDriveLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDriveGuardar = async () => {
    setDriveLoading(true);
    await guardarEnDrive();
    setDriveLoading(false);
  };

  const handleDriveCargar = async () => {
    setDriveLoading(true);
    await cargarDesdeDrive();
    setDriveLoading(false);
  };

  const handleReset = () => {
    if (
      window.confirm(
        '⚠️ ¿Estás seguro? Esto eliminará todo tu progreso guardado.'
      )
    ) {
      resetearTodo();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"
            >
              <GraduationCap size={20} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">UTN FRBA</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">
                Ingeniería en Sistemas
              </p>
            </div>
          </div>

          {/* Vista tabs */}
          <div className="hidden sm:flex items-center bg-gray-800/60 rounded-xl p-1 border border-gray-700/50">
            <TabButton
              active={vistaActual === 'plan'}
              onClick={() => onCambiarVista('plan')}
              icon={<LayoutDashboard size={14} />}
              label="Plan de Estudios"
            />
            <TabButton
              active={vistaActual === 'mapa'}
              onClick={() => onCambiarVista('mapa')}
              icon={<Map size={14} />}
              label="Mapa de Correlatividades"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1.5">
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
            {/* Drive */}
            <ActionButton
              onClick={handleDriveGuardar}
              icon={<Cloud size={14} />}
              label=""
              title="Guardar en Drive"
              variant="drive"
              loading={driveLoading}
            />
            <ActionButton
              onClick={handleDriveCargar}
              icon={<CloudDownload size={14} />}
              label=""
              title="Cargar desde Drive"
              variant="drive"
              loading={driveLoading}
            />
            {/* Reset */}
            <ActionButton
              onClick={handleReset}
              icon={<Trash2 size={14} />}
              label=""
              title="Resetear todo"
              variant="danger"
            />
          </div>
        </div>

        {/* Vista mobile tabs */}
        <div className="flex sm:hidden items-center gap-2 mt-3">
          <TabButton
            active={vistaActual === 'plan'}
            onClick={() => onCambiarVista('plan')}
            icon={<LayoutDashboard size={14} />}
            label="Plan"
          />
          <TabButton
            active={vistaActual === 'mapa'}
            onClick={() => onCambiarVista('mapa')}
            icon={<Map size={14} />}
            label="Mapa"
          />
        </div>
      </div>
    </header>
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
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-gray-400 hover:text-white'
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
  icon: React.ReactNode;
  label: string;
  title: string;
  variant: 'default' | 'drive' | 'danger';
  loading?: boolean;
}) {
  const variantClasses = {
    default: 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600',
    drive: 'border-blue-800/50 text-blue-400 hover:text-blue-300 hover:border-blue-700',
    danger: 'border-red-900/50 text-red-500 hover:text-red-400 hover:border-red-800',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      disabled={loading}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors bg-gray-900/50 ${variantClasses[variant]} ${loading ? 'opacity-50' : ''}`}
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
