import { CheckSquare, CalendarDays, BookOpen, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ModuleNavEntry {
  href:  string;
  label: string;
  icon:  LucideIcon;
}

export const MODULE_REGISTRY: Record<string, ModuleNavEntry> = {
  tareas:    { href: "/tareas",    label: "Tareas",    icon: CheckSquare },
  calendario: { href: "/calendario", label: "Calendario", icon: CalendarDays },
  wiki:      { href: "/wiki",      label: "Wiki",      icon: BookOpen },
  proyectos: { href: "/proyectos", label: "Proyectos", icon: Building2 },
};
