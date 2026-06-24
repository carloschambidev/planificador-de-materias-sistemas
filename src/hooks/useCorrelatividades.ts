// ============================================================
// HOOK: useCorrelatividades
// Lógica central de validación de prerequisitos
// ============================================================

import { useMemo } from 'react';
import { useCarreraStore } from '../store/useCarreraStore';
import { MATERIAS, getMateriaById } from '../data/materias';
import {
  cuentaComoAprobada,
  cuentaComoRegularizada,
  TRANSICIONES_VALIDAS,
  type EstadoMateria,
  type MateriaCompleta,
} from '../types';

/**
 * Calcula para cada materia:
 * - Si está bloqueada (no cumple correlatividades)
 * - Los motivos del bloqueo
 * - Los estados disponibles desde el estado actual
 *
 * Se recalcula reactivamente cuando cambia cualquier estado.
 */
export function useCorrelatividades(): {
  materias: MateriaCompleta[];
  getMateriaCompleta: (id: string) => MateriaCompleta | undefined;
  getEstadosDisponibles: (id: string) => EstadoMateria[];
} {
  const estadoMaterias = useCarreraStore((s) => s.estadoMaterias);

  const materias = useMemo<MateriaCompleta[]>(() => {
    return MATERIAS.map((def) => {
      const dinamico = estadoMaterias[def.id] ?? { estado: 'no-iniciada' as EstadoMateria };

      const motivoBloqueo: string[] = [];

      // ── Verificar regularizadas requeridas ──────────────────
      for (const reqId of def.regularizadasRequeridas) {
        const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
        if (!cuentaComoRegularizada(reqEstado)) {
          const reqDef = getMateriaById(reqId);
          motivoBloqueo.push(
            `${reqDef?.nombre ?? reqId} debe estar regularizada`
          );
        }
      }

      // ── Verificar aprobadas requeridas ──────────────────────
      for (const reqId of def.aprobadasRequeridas) {
        const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
        if (!cuentaComoAprobada(reqEstado)) {
          const reqDef = getMateriaById(reqId);
          motivoBloqueo.push(
            `${reqDef?.nombre ?? reqId} debe estar aprobada`
          );
        }
      }

      const estaBloqueada = motivoBloqueo.length > 0;

      return {
        ...def,
        estadoDinamico: dinamico,
        estaBloqueada,
        motivoBloqueo,
        // Aplicar personalizaciones del usuario
        nombre: dinamico.nombrePersonalizado ?? def.nombre,
        duracion: dinamico.duracionPersonalizada ?? def.duracion,
      };
    });
  }, [estadoMaterias]);

  const materiaMap = useMemo(
    () => new Map(materias.map((m) => [m.id, m])),
    [materias]
  );

  function getEstadosDisponibles(id: string): EstadoMateria[] {
    const materia = materiaMap.get(id);
    if (!materia) return [];

    const estadoActual = materia.estadoDinamico.estado;

    // Si está bloqueada, idealmente solo puede estar no-iniciada
    if (materia.estaBloqueada) {
      return ['no-iniciada'].filter((e) => e !== estadoActual) as EstadoMateria[];
    }

    const todosLosEstados: EstadoMateria[] = [
      'no-iniciada',
      'cursando',
      'regularizada',
      'aprobada',
      'promocionada'
    ];

    return todosLosEstados.filter((e) => e !== estadoActual);
  }

  return {
    materias,
    getMateriaCompleta: (id) => materiaMap.get(id),
    getEstadosDisponibles,
  };
}

/**
 * Calcula estadísticas de la carrera.
 */
export function useEstadisticas(materias: MateriaCompleta[]) {
  return useMemo(() => {
    const total = materias.length;
    const aprobadas = materias.filter(
      (m) => m.estadoDinamico.estado === 'aprobada'
    ).length;
    const promocionadas = materias.filter(
      (m) => m.estadoDinamico.estado === 'promocionada'
    ).length;
    const cursando = materias.filter(
      (m) => m.estadoDinamico.estado === 'cursando'
    ).length;
    const regularizadas = materias.filter(
      (m) => m.estadoDinamico.estado === 'regularizada'
    ).length;

    const completadas = aprobadas + promocionadas;
    const porcentaje = Math.round((completadas / total) * 100);
    const restantes = total - completadas;

    return {
      total,
      aprobadas,
      promocionadas,
      cursando,
      regularizadas,
      completadas,
      porcentaje,
      restantes,
    };
  }, [materias]);
}
