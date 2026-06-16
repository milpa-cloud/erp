"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { ESTADOS_TAREA, prioridadCls, prioridadLabel, formatFecha, isVencida } from "../types";
import type { Tarea } from "../types";

interface Props {
  tarea: Tarea;
  onEdit: (t: Tarea) => void;
  onDelete: (id: string) => void;
  onCambiarEstado: (id: string, estado: Tarea["estado"]) => void;
}

export function TareaCard({ tarea, onEdit, onDelete, onCambiarEstado }: Props) {
  const vencida = isVencida(tarea.fechaVencimiento, tarea.estado);

  return (
    <div
      className="bg-white rounded-xl p-4 border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => onEdit(tarea)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-stone-900 leading-snug">{tarea.titulo}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(tarea.id); }}
          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {tarea.descripcion && (
        <p className="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed">
          {tarea.descripcion}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prioridadCls(tarea.prioridad)}`}>
            {prioridadLabel(tarea.prioridad)}
          </span>
          {tarea.asignado && (
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-medium">
              {tarea.asignado}
            </span>
          )}
        </div>
        {tarea.fechaVencimiento && (
          <span className={`text-xs flex items-center gap-1 font-medium ${vencida ? "text-red-500" : "text-stone-400"}`}>
            {vencida && <AlertCircle className="w-3 h-3" />}
            {formatFecha(tarea.fechaVencimiento)}
          </span>
        )}
      </div>

      <div
        className="mt-3 pt-3 border-t border-stone-100 flex gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {ESTADOS_TAREA.map((e) => (
          <button
            key={e.key}
            onClick={() => onCambiarEstado(tarea.id, e.key)}
            title={e.label}
            className={`flex-1 py-1 rounded-full text-xs font-medium transition-colors ${
              tarea.estado === e.key
                ? e.key === "completada"
                  ? "bg-emerald-600 text-white"
                  : e.key === "en_progreso"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-stone-900 text-stone-50"
                : "bg-stone-50 text-stone-400 hover:bg-stone-100"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
