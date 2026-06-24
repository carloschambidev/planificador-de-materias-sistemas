// ============================================================
// COMPONENTE: MapaCorrelatividades
// Vista tabla estilo plan oficial UTN — tema claro
// Sin flechas ni grafo, solo cards por nivel con estado
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Clock, BookOpen, ChevronRight } from 'lucide-react';
import type { MateriaCompleta } from '../types';
import { ESTADO_CONFIG, BLOQUEADA_CONFIG, NIVELES_NOMBRES } from '../types';
import { getMateriaById } from '../data/materias';

interface Props {
  materias: MateriaCompleta[];
}

// Colores de encabezado por nivel — palette suave modo claro
const NIVEL_HEADER: Record<number, { bg: string; text: string; border: string; accent: string }> = {
  1: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD', accent: '#7C3AED' },
  2: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', accent: '#2563EB' },
  3: { bg: '#CFFAFE', text: '#0E7490', border: '#67E8F9', accent: '#0891B2' },
  4: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7', accent: '#059669' },
  5: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', accent: '#D97706' },
};

// Estilos de card según estado — versión clara
const CARD_ESTADO: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  'no-iniciada':    { bg: '#FFFFFF', border: '#E5E7EB', text: '#374151', badge: '#F3F4F6', badgeText: '#6B7280' },
  cursando:         { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', badge: '#3B82F6', badgeText: '#fff' },
  regularizada:     { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', badge: '#F59E0B', badgeText: '#fff' },
  'debe-final':     { bg: '#FFF7ED', border: '#F97316', text: '#9A3412', badge: '#F97316', badgeText: '#fff' },
  aprobada:         { bg: '#F0FDF4', border: '#22C55E', text: '#14532D', badge: '#22C55E', badgeText: '#fff' },
  promocionada:     { bg: '#F5F3FF', border: '#8B5CF6', text: '#4C1D95', badge: '#8B5CF6', badgeText: '#fff' },
  bloqueada:        { bg: '#E5E7EB', border: '#9CA3AF', text: '#4B5563', badge: '#D1D5DB', badgeText: '#374151' },
};

// ── Mini card para la grilla ────────────────────────────────
function MiniCard({ materia, onClick }: { materia: MateriaCompleta; onClick: () => void }) {
  const key = materia.estaBloqueada ? 'bloqueada' : materia.estadoDinamico.estado;
  const s = CARD_ESTADO[key] ?? CARD_ESTADO['no-iniciada'];
  const cfgEstado = materia.estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[materia.estadoDinamico.estado];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-xl border-2 p-2.5 transition-shadow group"
      style={{
        backgroundColor: s.bg,
        borderColor: s.border,
        boxShadow: materia.estaBloqueada ? 'none' : `0 2px 8px ${s.border}40`,
      }}
    >
      {/* Código + ícono */}
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[10px] font-mono font-bold leading-none px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: s.badge, color: s.badgeText }}
        >
          {materia.codigo}
        </span>
        <span className="text-sm opacity-70">
          {materia.estaBloqueada ? '🔒' : cfgEstado.icon}
        </span>
      </div>

      {/* Nombre */}
      <p
        className="text-[11px] font-semibold leading-tight"
        style={{ color: s.text }}
      >
        {materia.nombre}
      </p>

      {/* Estado badge */}
      <div className="mt-1.5 flex items-center justify-between">
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: s.badge + '30', color: materia.estaBloqueada ? s.badgeText : s.border }}
        >
          {materia.estaBloqueada ? 'Bloqueada' : cfgEstado.label}
        </span>
        <ChevronRight size={10} className="opacity-30 group-hover:opacity-60 transition-opacity" />
      </div>
    </motion.button>
  );
}

// ── Modal de detalle al hacer click ────────────────────────
function DetalleModal({ materia, onClose }: { materia: MateriaCompleta; onClose: () => void }) {
  const key = materia.estaBloqueada ? 'bloqueada' : materia.estadoDinamico.estado;
  const s = CARD_ESTADO[key] ?? CARD_ESTADO['no-iniciada'];
  const cfgEstado = materia.estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[materia.estadoDinamico.estado];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-sm rounded-2xl border-2 shadow-2xl overflow-hidden z-10"
          style={{
            backgroundColor: s.bg,
            borderColor: s.border,
            boxShadow: `0 20px 60px ${s.border}50`,
          }}
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${s.border}18 0%, transparent 70%)` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                    style={{ backgroundColor: s.badge, color: s.badgeText }}
                  >
                    {materia.codigo}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: s.border + '20', color: s.border }}
                  >
                    {materia.estaBloqueada ? '🔒 Bloqueada' : `${cfgEstado.icon} ${cfgEstado.label}`}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-snug" style={{ color: s.text }}>
                  {materia.nombre}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Meta */}
            <div className="flex gap-3 mt-2 text-xs" style={{ color: s.text + 'AA' }}>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {(materia.estadoDinamico.duracionPersonalizada ?? materia.duracion) === 'anual' ? 'Anual' : 'Cuatrimestral'}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                Nivel {materia.nivel}
              </span>
              {materia.esElectiva && (
                <span className="text-purple-500 font-medium">Electiva</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pb-5 space-y-3">
            {/* Bloqueo */}
            {materia.estaBloqueada && materia.motivoBloqueo.length > 0 && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lock size={13} className="text-red-500" />
                  <span className="text-xs font-semibold text-red-600">Requisitos pendientes</span>
                </div>
                <ul className="space-y-1">
                  {materia.motivoBloqueo.map((m, i) => (
                    <li key={i} className="text-xs text-red-500 flex items-start gap-1">
                      <span className="mt-0.5">·</span><span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Correlatividades */}
            {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0) && (
              <div className="space-y-2">
                {materia.regularizadasRequeridas.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Regularizadas requeridas</p>
                    <div className="flex flex-wrap gap-1">
                      {materia.regularizadasRequeridas.map(id => {
                        const def = getMateriaById(id);
                        return (
                          <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-700">
                            {def?.nombre ?? id}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {materia.aprobadasRequeridas.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Aprobadas requeridas</p>
                    <div className="flex flex-wrap gap-1">
                      {materia.aprobadasRequeridas.map(id => {
                        const def = getMateriaById(id);
                        return (
                          <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 border border-green-300 text-green-700">
                            {def?.nombre ?? id}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            {materia.estadoDinamico.notasPersonales && (
              <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-700">
                📝 {materia.estadoDinamico.notasPersonales}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Panel de estadísticas superior ─────────────────────────
function StatsBar({ materias }: { materias: MateriaCompleta[] }) {
  const total = materias.length;
  const aprobadas = materias.filter(m => m.estadoDinamico.estado === 'aprobada').length;
  const promocionadas = materias.filter(m => m.estadoDinamico.estado === 'promocionada').length;
  const cursando = materias.filter(m => m.estadoDinamico.estado === 'cursando').length;
  const regularizadas = materias.filter(m => m.estadoDinamico.estado === 'regularizada').length;
  const bloqueadas = materias.filter(m => m.estaBloqueada).length;
  const completadas = aprobadas + promocionadas;
  const pct = Math.round((completadas / total) * 100);
  const restantes = total - completadas;

  const items = [
    { label: 'Total', value: total, color: '#6B7280', bg: '#F3F4F6' },
    { label: 'Aprobadas', value: aprobadas, color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Promocionadas', value: promocionadas, color: '#059669', bg: '#ECFDF5' },
    { label: 'Cursando', value: cursando, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Regularizadas', value: regularizadas, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Bloqueadas', value: bloqueadas, color: '#9CA3AF', bg: '#F9FAFB' },
    { label: 'Restantes', value: restantes, color: '#DC2626', bg: '#FEF2F2' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Progreso general</span>
        <span className="text-2xl font-black" style={{ color: pct >= 60 ? '#16A34A' : pct >= 30 ? '#2563EB' : '#6B7280' }}>
          {pct}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: pct >= 60 ? '#16A34A' : pct >= 30 ? '#2563EB' : '#9CA3AF' }}
        />
      </div>
      {/* Stats chips */}
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
            style={{ backgroundColor: item.bg, borderColor: item.color + '40', color: item.color }}
          >
            <span className="text-base font-black">{item.value}</span>
            <span className="font-medium text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────
export function MapaCorrelatividades({ materias }: Props) {
  const [seleccionada, setSeleccionada] = useState<MateriaCompleta | null>(null);

  // Agrupar por nivel
  const porNivel = new Map<number, MateriaCompleta[]>();
  for (const m of materias) {
    if (!porNivel.has(m.nivel)) porNivel.set(m.nivel, []);
    porNivel.get(m.nivel)!.push(m);
  }

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
      {/* Stats bar */}
      <StatsBar materias={materias} />

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: 'bloqueada', label: 'Bloqueada' },
          { key: 'no-iniciada', label: 'No iniciada' },
          { key: 'cursando', label: 'Cursando' },
          { key: 'regularizada', label: 'Regularizada' },
          { key: 'debe-final', label: 'Debe Final' },
          { key: 'aprobada', label: 'Aprobada' },
          { key: 'promocionada', label: 'Promocionada' },
        ].map(({ key, label }) => {
          const s = CARD_ESTADO[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm border-2"
                style={{ backgroundColor: s.bg, borderColor: s.border }}
              />
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Tabla de niveles — scroll horizontal en mobile */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 w-full min-w-max">
          {[1, 2, 3, 4, 5].map(nivel => {
            const cols = porNivel.get(nivel) ?? [];
            const nh = NIVEL_HEADER[nivel];
            const aprobadas = cols.filter(m =>
              m.estadoDinamico.estado === 'aprobada' || m.estadoDinamico.estado === 'promocionada'
            ).length;

            return (
              <div key={nivel} className="flex flex-col flex-1 min-w-[160px]">
                {/* Encabezado nivel */}
                <div
                  className="rounded-xl px-3 py-2.5 mb-2 text-center border"
                  style={{ backgroundColor: nh.bg, borderColor: nh.border }}
                >
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: nh.text }}>
                    {NIVELES_NOMBRES[nivel]}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: nh.accent }}>
                    {aprobadas}/{cols.length} completadas
                  </p>
                  {/* Mini progress */}
                  <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: nh.border + '50' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cols.length > 0 ? (aprobadas / cols.length) * 100 : 0}%`,
                        backgroundColor: nh.accent,
                      }}
                    />
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {cols.map((materia, i) => (
                    <motion.div
                      key={materia.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <MiniCard
                        materia={materia}
                        onClick={() => setSeleccionada(materia)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal detalle */}
      <AnimatePresence>
        {seleccionada && (
          <DetalleModal
            materia={seleccionada}
            onClose={() => setSeleccionada(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
