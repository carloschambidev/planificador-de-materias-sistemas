// ============================================================
// ZUSTAND STORE – Estado global con persistencia en LocalStorage
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EstadoMateria, EstadoDinamico, DuracionMateria } from '../types';
import { MATERIAS } from '../data/materias';

/** Clave usada en LocalStorage */
const STORAGE_KEY = 'utn-frba-planificador-v1';

interface CarreraStore {
  /** Mapa de ID de materia → estado dinámico */
  estadoMaterias: Record<string, EstadoDinamico>;

  /** Acciones */
  setEstado: (id: string, estado: EstadoMateria) => void;
  setNombrePersonalizado: (id: string, nombre: string) => void;
  setDuracionPersonalizada: (id: string, duracion: DuracionMateria) => void;
  setNotas: (id: string, notas: string) => void;
  resetearTodo: () => void;

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

      resetearTodo: () => {
        set({ estadoMaterias: crearEstadoInicial() });
      },

      exportarJSON: () => {
        const data = {
          version: 1,
          exportadoEn: new Date().toISOString(),
          estadoMaterias: get().estadoMaterias,
        };
        return JSON.stringify(data, null, 2);
      },

      importarJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.estadoMaterias && typeof data.estadoMaterias === 'object') {
            // Merge con el estado inicial para no perder materias nuevas
            const estadoBase = crearEstadoInicial();
            const merged = { ...estadoBase, ...data.estadoMaterias };
            set({ estadoMaterias: merged });
          } else {
            throw new Error('Formato inválido');
          }
        } catch {
          alert('Error al importar: el archivo no es válido.');
        }
      },

      // ── Google Drive stubs ──────────────────────────────────
      // TODO: Implementar OAuth de Google y Drive API
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
