export interface Proyecto {
  id: string;
  nombre: string;
  cliente: string;
  ubicacion: string;
  industria: string;
  descripcion: string;
  estado: "activo" | "en_desarrollo" | "completado" | "pausado";
  creadoPor: string;
  creadoEn: string;
}

export interface PuntoProyecto {
  id: string;
  proyectoId: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  creadoPor: string;
  creadoEn: string;
}

export interface ModuloProyecto {
  id: string;
  proyectoId: string;
  nombre: string;
  descripcion: string;
  estado: "pendiente" | "en_desarrollo" | "completado";
}

export const ESTADOS_PROYECTO = [
  { value: "en_desarrollo" as const, label: "En desarrollo", color: "bg-amber-100 text-amber-700" },
  { value: "activo"        as const, label: "Activo",        color: "bg-emerald-100 text-emerald-700" },
  { value: "pausado"       as const, label: "Pausado",       color: "bg-stone-100 text-stone-600" },
  { value: "completado"    as const, label: "Completado",    color: "bg-blue-100 text-blue-700" },
];

export const ESTADOS_MODULO = {
  pendiente:     { label: "Pendiente",     dot: "bg-stone-300" },
  en_desarrollo: { label: "En desarrollo", dot: "bg-amber-400" },
  completado:    { label: "Completado",    dot: "bg-emerald-500" },
} as const;

export const MODULOS_SUGERIDOS = [
  "Sitio Web",
  "Newsletter / Email Marketing",
  "CRM / Contactos",
  "E-commerce / Tienda Online",
  "Inventario",
  "Agenda / Calendario",
  "Portal Cliente",
  "Blog / Contenido",
  "Reportes y Analytics",
  "Sistema de Reservas",
  "App Móvil",
  "Integración de Pagos",
];

export function estadoBadge(estado: Proyecto["estado"]) {
  return ESTADOS_PROYECTO.find((e) => e.value === estado)?.color ?? "bg-stone-100 text-stone-600";
}

export function estadoLabel(estado: Proyecto["estado"]) {
  return ESTADOS_PROYECTO.find((e) => e.value === estado)?.label ?? estado;
}
