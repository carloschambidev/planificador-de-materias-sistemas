// ============================================================
// HOOK: usePlanificador
// Lógica de predicción de correlatividades y cálculo de horas para Mi Plan
// ============================================================

import { useMemo, useCallback } from 'react';
import { useCarreraStore } from '../store/useCarreraStore';
import { getMateriaById } from '../data/materias';
import { useCorrelatividades } from './useCorrelatividades';
import {
  cuentaComoAprobada,
  cuentaComoRegularizada,
  type PeriodoPlan,
  type MateriaCompleta,
} from '../types';

/**
 * Parsea el string de carga horaria de una materia y lo convierte a horas semanales numéricas.
 * Ejemplos: "5Hs" -> 5, "6Hs" -> 6, "200Hs Reloj" -> 10 (carga semanal estimada para PPS).
 */
export function parsearHoras(horasStr?: string): number {
  if (!horasStr) return 0;
  if (horasStr.includes('200Hs Reloj')) {
    return 10; // Carga horaria semanal equivalente estimada para Práctica Profesional Supervisada
  }
  const num = parseInt(horasStr, 10);
  return isNaN(num) ? 0 : num;
}

export interface AlertaCorrelativa {
  faltaCorrelativa: boolean;
  motivos: string[];
}

export interface TermometroConfig {
  nivel: 'verde' | 'amarillo' | 'rojo';
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

export function usePlanificador() {
  const { estadoMaterias, planPersonalizado } = useCarreraStore();
  const { materias: todasMateriasCompleta } = useCorrelatividades();

  /**
   * Catálogo de materias disponibles en el Sidebar.
   * Filtro:
   * 1. No mostrar las materias ya marcadas en la vida real como "aprobada", "promocionada" o "regularizada"
   * 2. No mostrar las materias que el usuario ya ubicó en el planPersonalizado
   */
  const materiasDisponibles = useMemo<MateriaCompleta[]>(() => {
    return todasMateriasCompleta.filter((m) => {
      const estadoReal = estadoMaterias[m.id]?.estado;
      const yaEnVidaReal =
        estadoReal && ['regularizada', 'aprobada', 'promocionada'].includes(estadoReal);
      if (yaEnVidaReal) return false;

      const yaEnPlan = planPersonalizado.some((item) => item.idMateria === m.id);
      if (yaEnPlan) return false;

      return true;
    });
  }, [todasMateriasCompleta, estadoMaterias, planPersonalizado]);

  /**
   * Validador predictivo:
   * Si una materia se coloca en un Año / Periodo, evalúa si sus correlativas requeridas
   * fueron aprobadas/regularizadas en la vida real O ubicadas previamente en el plan.
   */
  const getAlertaCorrelativas = useCallback(
    (idMateria: string, anio: number, periodo: PeriodoPlan): AlertaCorrelativa => {
      const def = getMateriaById(idMateria);
      if (!def) return { faltaCorrelativa: false, motivos: [] };

      const motivos: string[] = [];

      // ── Validar regularizadas requeridas ──────────────────
      for (const reqId of def.regularizadasRequeridas) {
        const estadoReal = estadoMaterias[reqId]?.estado;
        const enVidaReal = estadoReal && cuentaComoRegularizada(estadoReal);
        if (enVidaReal) continue;

        // Buscar en planPersonalizado
        const itemPlan = planPersonalizado.find((item) => item.idMateria === reqId);
        if (!itemPlan) {
          const mDef = getMateriaById(reqId);
          motivos.push(`Falta cursar ${mDef?.codigo ?? reqId}`);
          continue;
        }

        // Si está en el plan, debe ser un año anterior O un período anterior en el mismo año
        const esAnioAnterior = itemPlan.anio < anio;
        const esPeriodoAnteriorEnMismoAnio =
          itemPlan.anio === anio && itemPlan.periodo === '1C' && periodo === '2C';

        if (!esAnioAnterior && !esPeriodoAnteriorEnMismoAnio) {
          const mDef = getMateriaById(reqId);
          motivos.push(`${mDef?.codigo ?? reqId} debe cursarse en año previo o 1C`);
        }
      }

      // ── Validar aprobadas requeridas (finales) ─────────────
      for (const reqId of def.aprobadasRequeridas) {
        const estadoReal = estadoMaterias[reqId]?.estado;
        const enVidaReal = estadoReal && cuentaComoAprobada(estadoReal);
        if (enVidaReal) continue;

        const itemPlan = planPersonalizado.find((item) => item.idMateria === reqId);
        if (!itemPlan) {
          const mDef = getMateriaById(reqId);
          motivos.push(`Falta aprobar final ${mDef?.codigo ?? reqId}`);
          continue;
        }

        // Para finales requeridos, la correlativa debe ubicarse en un año anterior
        if (itemPlan.anio >= anio) {
          const mDef = getMateriaById(reqId);
          motivos.push(`Final de ${mDef?.codigo ?? reqId} pendiente antes del Año ${anio}`);
        }
      }

      return {
        faltaCorrelativa: motivos.length > 0,
        motivos,
      };
    },
    [estadoMaterias, planPersonalizado]
  );

  /**
   * Suma de horas por cuatrimestre:
   * Las materias Anuales suman sus horas a ambos cuatrimestres de ese año.
   */
  const getHorasCuatrimestre = useCallback(
    (anio: number, cuatrimestre: '1C' | '2C', idExcluir?: string, materiaAdicional?: string): number => {
      const itemsAnio = planPersonalizado.filter(
        (i) => i.anio === anio && (i.periodo === cuatrimestre || i.periodo === 'Anual') && i.idMateria !== idExcluir
      );

      let total = 0;
      for (const item of itemsAnio) {
        const def = getMateriaById(item.idMateria);
        total += parsearHoras(def?.horas);
      }

      if (materiaAdicional) {
        const defAd = getMateriaById(materiaAdicional);
        total += parsearHoras(defAd?.horas);
      }

      return total;
    },
    [planPersonalizado]
  );

  /**
   * Configuración y color del termómetro de carga horaria
   */
  const getNivelTermometro = useCallback((horas: number): TermometroConfig => {
    if (horas <= 10) {
      return {
        nivel: 'verde',
        label: `${horas}hs/sem · Carga Ligera`,
        color: '#10B981',
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/40',
        text: 'text-emerald-300',
      };
    }
    if (horas <= 16) {
      return {
        nivel: 'amarillo',
        label: `${horas}hs/sem · Carga Equilibrada`,
        color: '#F59E0B',
        bg: 'bg-amber-950/40',
        border: 'border-amber-500/40',
        text: 'text-amber-300',
      };
    }
    return {
      nivel: 'rojo',
      label: `${horas}hs/sem · Carga Intensa (>16hs)`,
      color: '#EF4444',
      bg: 'bg-red-950/50',
      border: 'border-red-500/60',
      text: 'text-red-300',
    };
  }, []);

  return {
    materiasDisponibles,
    getAlertaCorrelativas,
    getHorasCuatrimestre,
    getNivelTermometro,
  };
}
