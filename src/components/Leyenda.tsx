// ============================================================
// COMPONENTE: Leyenda de estados
// ============================================================

import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from '../types';

export function Leyenda() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
      {/* Bloqueada primero */}
      <LeyendaItem
        icon={BLOQUEADA_CONFIG.icon}
        label={BLOQUEADA_CONFIG.label}
        color={BLOQUEADA_CONFIG.color}
      />
      {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => (
        <LeyendaItem
          key={key}
          icon={cfg.icon}
          label={cfg.label}
          color={cfg.color}
        />
      ))}
    </div>
  );
}

function LeyendaItem({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
        style={{ backgroundColor: color + '33', border: `1px solid ${color}66` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
