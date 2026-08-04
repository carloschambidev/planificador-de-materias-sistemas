// ============================================================
// ZUSTAND STORE – Estado global con persistencia en LocalStorage
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  EstadoMateria, 
  EstadoDinamico, 
  DuracionMateria, 
  ItemPlanPersonalizado, 
  PeriodoPlan 
} from '../types';
import { MATERIAS } from '../data/materias';

/** Clave usada en LocalStorage */
const STORAGE_KEY = 'utn-frba-planificador-v1';

interface CarreraStore {
  /** Mapa de ID de materia → estado dinámico */
  estadoMaterias: Record<string, EstadoDinamico>;

  /** Plan personalizado del usuario (Mi Plan) */
  planPersonalizado: ItemPlanPersonalizado[];
  /** Número total de años en el tablero de Mi Plan */
  totalAniosPlan: number;

  /** Acciones */
  setEstado: (id: string, estado: EstadoMateria) => void;
  setNombrePersonalizado: (id: string, nombre: string) => void;
  setDuracionPersonalizada: (id: string, duracion: DuracionMateria) => void;
  setNotas: (id: string, notas: string) => void;
  asignarElectiva: (materiaSlotId: string, electivaId: string) => void;
  resetearTodo: () => void;

  /** Acciones para Mi Plan */
  agregarAlPlan: (idMateria: string, anio: number, periodo: PeriodoPlan) => void;
  moverEnPlan: (idMateria: string, anio: number, periodo: PeriodoPlan) => void;
  removerDelPlan: (idMateria: string) => void;
  agregarAnioPlan: () => void;
  limpiarPlanPersonalizado: () => void;

  /** Importar/Exportar */
  exportarJSON: () => string;
  importarJSON: (json: string) => void;

  /** Google Drive (stub – a implementar con OAuth) */
  guardarEnDrive: () => Promise<void>;
  cargarDesdeDrive: () => Promise<void>;
}

/** Estado inicial: todas las materias en 'no-iniciada' */
function crearEstadoInicial(): Record<string, EstadoDinamico> {
  const estado: Record<string, EstadoDinamico> = {};
  for (const materia of MATERIAS) {
    estado[materia.id] = {
      estado: 'no-iniciada',
    };
  }
  return estado;
}

export const useCarreraStore = create<CarreraStore>()(
  persist(
    (set, get) => ({
      estadoMaterias: crearEstadoInicial(),
      planPersonalizado: [],
      totalAniosPlan: 5,

      setEstado: (id, estado) => {
        set((s) => ({
          estadoMaterias: {
            ...s.estadoMaterias,
            [id]: { ...s.estadoMaterias[id], estado },
          },
        }));
      },

      setNombrePersonalizado: (id, nombre) => {
        set((s) => ({
          estadoMaterias: {
            ...s.estadoMaterias,
            [id]: { ...s.estadoMaterias[id], nombrePersonalizado: nombre },
          },
        }));
      },

      setDuracionPersonalizada: (id, duracion) => {
        set((s) => ({
          estadoMaterias: {
            ...s.estadoMaterias,
            [id]: { ...s.estadoMaterias[id], duracionPersonalizada: duracion },
          },
        }));
      },

      setNotas: (id, notas) => {
        set((s) => ({
          estadoMaterias: {
            ...s.estadoMaterias,
            [id]: { ...s.estadoMaterias[id], notasPersonales: notas },
          },
        }));
      },

      asignarElectiva: (materiaSlotId, electivaId) => {
        set((s) => ({
          estadoMaterias: {
            ...s.estadoMaterias,
            [materiaSlotId]: { ...s.estadoMaterias[materiaSlotId], electivaAsignadaId: electivaId },
          },
        }));
      },

      agregarAlPlan: (idMateria, anio, periodo) => {
        set((s) => {
          const filtrado = s.planPersonalizado.filter((item) => item.idMateria !== idMateria);
          return {
            planPersonalizado: [...filtrado, { idMateria, anio, periodo }],
          };
        });
      },

      moverEnPlan: (idMateria, anio, periodo) => {
        set((s) => {
          const filtrado = s.planPersonalizado.filter((item) => item.idMateria !== idMateria);
          return {
            planPersonalizado: [...filtrado, { idMateria, anio, periodo }],
          };
        });
      },

      removerDelPlan: (idMateria) => {
        set((s) => ({
          planPersonalizado: s.planPersonalizado.filter((item) => item.idMateria !== idMateria),
        }));
      },

      agregarAnioPlan: () => {
        set((s) => ({
          totalAniosPlan: s.totalAniosPlan + 1,
        }));
      },

      limpiarPlanPersonalizado: () => {
        set({ planPersonalizado: [] });
      },

      resetearTodo: () => {
        set({ 
          estadoMaterias: crearEstadoInicial(),
          planPersonalizado: [],
          totalAniosPlan: 5,
        });
      },

      exportarJSON: () => {
        const data = {
          version: 2,
          exportadoEn: new Date().toISOString(),
          estadoMaterias: get().estadoMaterias,
          planPersonalizado: get().planPersonalizado,
          totalAniosPlan: get().totalAniosPlan,
        };
        return JSON.stringify(data, null, 2);
      },

      importarJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.estadoMaterias && typeof data.estadoMaterias === 'object') {
            const estadoBase = crearEstadoInicial();
            const merged = { ...estadoBase, ...data.estadoMaterias };
            set({ 
              estadoMaterias: merged,
              planPersonalizado: Array.isArray(data.planPersonalizado) ? data.planPersonalizado : [],
              totalAniosPlan: typeof data.totalAniosPlan === 'number' ? data.totalAniosPlan : 5,
            });
          } else {
            throw new Error('Formato inválido');
          }
        } catch {
          alert('Error al importar: el archivo no es válido.');
        }
      },

      // ── Google Drive stubs ──────────────────────────────────
      guardarEnDrive: async () => {
        const json = get().exportarJSON();
        console.log('[Drive] Simulando guardado en Drive:', json.length, 'bytes');
        await new Promise((r) => setTimeout(r, 1200));
        alert('✅ Guardado en Drive (simulado). Para conectar la API real, configurar OAuth de Google.');
      },

      cargarDesdeDrive: async () => {
        console.log('[Drive] Simulando carga desde Drive...');
        await new Promise((r) => setTimeout(r, 1200));
        alert('📂 Carga desde Drive (simulado). Para conectar la API real, configurar OAuth de Google.');
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
