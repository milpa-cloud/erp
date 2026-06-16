export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "en_progreso" | "completada";
  prioridad: "alta" | "media" | "baja";
  asignado: string;
  creadoPor: string;
  fechaVencimiento: string | null;
  creadoEn: string;
  proyectoId?: string | null;
}

export const ESTADOS_TAREA = [
  { key: "pendiente"   as const, label: "Pendiente",   color: "text-stone-500" },
  { key: "en_progreso" as const, label: "En progreso", color: "text-amber-500" },
  { key: "completada"  as const, label: "Completada",  color: "text-emerald-600" },
];

export const PRIORIDADES_TAREA = [
  { key: "alta"  as const, label: "Alta",  cls: "bg-red-50 text-red-600 border border-red-200" },
  { key: "media" as const, label: "Media", cls: "bg-amber-50 text-amber-600 border border-amber-200" },
  { key: "baja"  as const, label: "Baja",  cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
];

export function prioridadCls(p: Tarea["prioridad"]) {
  return PRIORIDADES_TAREA.find((x) => x.key === p)?.cls ?? "";
}

export function prioridadLabel(p: Tarea["prioridad"]) {
  return PRIORIDADES_TAREA.find((x) => x.key === p)?.label ?? p;
}

export function formatFecha(d: string | null) {
  if (!d) return null;
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export function isVencida(d: string | null, estado: Tarea["estado"]) {
  if (!d || estado === "completada") return false;
  return new Date(d) < new Date(new Date().toDateString());
}
