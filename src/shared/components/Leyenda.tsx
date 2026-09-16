// ============================================================
// COMPONENTE: Leyenda de estados
// ============================================================

import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from "../../core/types";

export function Leyenda() {
  return (
    <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:items-center md:gap-x-4 md:gap-y-2 md:px-1">
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
    <div className="flex items-center gap-1.5 justify-center md:justify-start">
      <div
        className="w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[10px] md:text-xs shrink-0"
        style={{ backgroundColor: color + '33', border: `1px solid ${color}66` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <span className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 truncate">{label}</span>
    </div>
  );
}
