// milpa.config.ts — configuración de esta instancia del sistema
// Cambiar SOLO este archivo para personalizar para un cliente nuevo.
// NUNCA hardcodear estos valores dentro de los módulos o componentes.

export const config = {
  cliente: {
    nombre: "Milpa — Equipo interno",
    slug: "milpa-erp",
    locale: "es" as const,
  },
  // Solo los módulos listados aquí aparecen en el sidebar.
  // Para activar un módulo: agregar el slug + correr su migración SQL.
  modulos: ["tareas", "calendario", "wiki", "proyectos"] as const,
} as const;

export type ModuloSlug = (typeof config.modulos)[number];
