"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { escucharTareas, actualizarTarea, eliminarTarea } from "@/modules/tareas/queries";
import { ESTADOS_TAREA } from "@/modules/tareas/types";
import type { Tarea } from "@/modules/tareas/types";
import { TareaModal } from "@/modules/tareas/components/TareaModal";
import { KanbanColumn } from "@/modules/tareas/components/KanbanColumn";

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [modal, setModal] = useState<Partial<Tarea> | null>(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState<Tarea["prioridad"] | "todas">("todas");

  useEffect(() => {
    return escucharTareas(setTareas);
  }, []);

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar esta tarea?")) await eliminarTarea(id);
  }

  async function handleCambiarEstado(id: string, estado: Tarea["estado"]) {
    await actualizarTarea(id, { estado });
  }

  const filtradas =
    filtroPrioridad === "todas"
      ? tareas
      : tareas.filter((t) => t.prioridad === filtroPrioridad);

  const por = (estado: Tarea["estado"]) => filtradas.filter((t) => t.estado === estado);
  const totalCompletadas = tareas.filter((t) => t.estado === "completada").length;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl text-stone-900 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Tareas
          </h1>
          {tareas.length > 0 && (
            <p className="text-xs text-stone-400 mt-0.5">
              {totalCompletadas} de {tareas.length} completadas
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1">
            {(["todas", "alta", "media", "baja"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFiltroPrioridad(p)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
                  filtroPrioridad === p
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {p === "todas" ? "Todas" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal({})}
            className="flex items-center gap-2 bg-stone-900 text-stone-50 px-4 py-2 rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva tarea
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-5 min-w-0 h-full">
          {ESTADOS_TAREA.map((e) => (
            <KanbanColumn
              key={e.key}
              estado={e}
              tareas={por(e.key)}
              onEdit={(t) => setModal(t)}
              onDelete={handleDelete}
              onCambiarEstado={handleCambiarEstado}
            />
          ))}
        </div>
      </div>

      {modal !== null && (
        <TareaModal tarea={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
