// ============================================================
// EXPORTADOR PDF: MiPlanPDFExport
// Genera reporte institucional de Mi Plan en formato de TABLA GLOBAL POR COLUMNAS DE AÑO ACADÉMICO
// (Estilo Matriz Curricular / Plan de Estudio Franja Morada)
// ============================================================

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ItemPlanPersonalizado, PeriodoPlan } from '../../types';
import { getMateriaById } from '../../data/materias';
import { parsearHoras } from '../../hooks/usePlanificador';

export function exportarMiPlanPDF(
  itemsPlan: ItemPlanPersonalizado[],
  totalAniosPlan: number
): void {
  // Utilizamos orientación apaisada ('landscape') para que las columnas de años académicos
  // tengan amplitud visual como en las cartas curriculares oficiales.
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const anios = Array.from({ length: totalAniosPlan }, (_, i) => i + 1);

  // ── Encabezado Institucional ─────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('UTN FRBA · Planificador de Materias', 14, 18);

  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text('Matriz Curricular · Mi Plan Personalizado', 14, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Generado el ${fecha}`, 14, 32);

  // ── Recuadro Resumen Estadístico (Ancho 269mm en Landscape A4) ──
  const totalMaterias = itemsPlan.length;
  const promedioPorAnio =
    totalAniosPlan > 0 ? (totalMaterias / totalAniosPlan).toFixed(1) : '0';

  let totalHorasGlobales = 0;
  for (const item of itemsPlan) {
    const m = getMateriaById(item.idMateria);
    totalHorasGlobales += parsearHoras(m?.horas);
  }

  // Fondo del recuadro
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 37, 269, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Resumen del Plan de Estudio:', 18, 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Total de Años Planificados: ${totalAniosPlan} años`, 18, 50);
  doc.text(`• Total de Asignaturas: ${totalMaterias} materias`, 105, 50);
  doc.text(`• Promedio por Año: ${promedioPorAnio} mat/año`, 195, 50);

  // ── Construcción de la Tabla Global (Columnas = Años Académicos) ──
  const perOrden: Record<PeriodoPlan, number> = { Anual: 1, '1C': 2, '2C': 3 };

  const materiasPorAnio: Record<number, string[]> = {};
  let maxFilas = 0;

  for (const anio of anios) {
    const itemsAnio = itemsPlan
      .filter((item) => item.anio === anio)
      .sort((a, b) => {
        if (perOrden[a.periodo] !== perOrden[b.periodo]) {
          return perOrden[a.periodo] - perOrden[b.periodo];
        }
        const m1 = getMateriaById(a.idMateria)?.nombre ?? a.idMateria;
        const m2 = getMateriaById(b.idMateria)?.nombre ?? b.idMateria;
        return m1.localeCompare(m2);
      });

    materiasPorAnio[anio] = itemsAnio.map((item) => {
      const def = getMateriaById(item.idMateria);
      const nombre = def?.nombre ?? item.idMateria;
      const codigo = def?.codigo ?? '';
      const periodoTexto =
        item.periodo === 'Anual'
          ? 'Anual'
          : item.periodo === '1C'
          ? '1º Cuat.'
          : '2º Cuat.';
      const horasTexto = def?.horas ? ` • ${def.horas}` : '';
      return `${nombre}\n[${codigo}] • ${periodoTexto}${horasTexto}`;
    });

    if (materiasPorAnio[anio].length > maxFilas) {
      maxFilas = materiasPorAnio[anio].length;
    }
  }

  // Asegurar al menos 1 fila en caso de que el plan esté vacío
  if (maxFilas === 0) maxFilas = 1;

  // Construir matriz fila por fila (cada celda corresponde a la materia del i-ésimo año)
  const bodyData: string[][] = [];
  for (let r = 0; r < maxFilas; r++) {
    const fila: string[] = [];
    for (const anio of anios) {
      fila.push(materiasPorAnio[anio][r] ?? '');
    }
    bodyData.push(fila);
  }

  // Pie de tabla con total de materias y horas por cada Año Académico
  const footData: string[] = anios.map((anio) => {
    const itemsAnio = itemsPlan.filter((item) => item.anio === anio);
    const count = itemsAnio.length;
    let horasTotal = 0;
    for (const it of itemsAnio) {
      const def = getMateriaById(it.idMateria);
      horasTotal += parsearHoras(def?.horas);
    }
    if (count === 0) return 'Sin asignaturas';
    return `Total: ${count} ${count === 1 ? 'materia' : 'materias'} • ${horasTotal}Hs`;
  });

  // Renderizar la tabla con jspdf-autotable
  autoTable(doc, {
    startY: 60,
    head: [anios.map((a) => `${a}º AÑO ACADÉMICO`)],
    body: bodyData,
    foot: [footData],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 4,
      textColor: [30, 41, 59],
      halign: 'center',
      valign: 'middle',
      lineColor: [203, 213, 225], // Slate-300 para bordes de cuadrícula nítidos
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [67, 56, 202], // Indigo-700
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9.5,
      halign: 'center',
    },
    footStyles: {
      fillColor: [30, 41, 59], // Slate-800
      textColor: [241, 245, 249],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate-50 suave para fácil lectura
    },
  });

  // Descargar el archivo PDF
  doc.save(`mi-plan-utn-frba-${new Date().toISOString().slice(0, 10)}.pdf`);
}
