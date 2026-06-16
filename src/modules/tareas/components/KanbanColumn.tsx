"use client";

import { Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { TareaCard } from "./TareaCard";
import type { Tarea } from "../types";

const ESTADO_ICONS: Record<Tarea["estado"], React.ReactNode> = {
  pendiente:   <Clock className="w-4 h-4" />,
  en_progreso: <ChevronRight className="w-4 h-4" />,
  completada:  <CheckCircle2 className="w-4 h-4" />,
};

interface Props {
  estado: { key: Tarea["estado"]; label: string; color: string };
  tareas: Tarea[];
  onEdit: (t: Tarea) => void;
  onDelete: (id: string) => void;
  onCambiarEstado: (id: string, e: Tarea["estado"]) => void;
}

export function KanbanColumn({ estado, tareas, onEdit, onDelete, onCambiarEstado }: Props) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={estado.color}>{ESTADO_ICONS[estado.key]}</span>
        <h3 className="text-sm font-bold text-stone-700">{estado.label}</h3>
        <span className="ml-auto bg-stone-200 text-stone-500 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
          {tareas.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-16">
        {tareas.map((t) => (
          <TareaCard
            key={t.id}
            tarea={t}
            onEdit={onEdit}
            onDelete={onDelete}
            onCambiarEstado={onCambiarEstado}
          />
        ))}
        {tareas.length === 0 && (
          <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center text-xs text-stone-300 font-medium">
            Sin tareas
          </div>
        )}
      </div>
    </div>
  );
}
