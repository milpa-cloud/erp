"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { escucharTareasDeProyecto, crearTarea, actualizarTarea, eliminarTarea } from "@/modules/tareas/queries";
import type { Tarea } from "@/modules/tareas/types";

function getNombre() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("milpa_nombre") || "";
}

const PRIORIDADES = {
  alta:  { label: "Alta",  color: "text-red-600 bg-red-50" },
  media: { label: "Media", color: "text-amber-600 bg-amber-50" },
  baja:  { label: "Baja",  color: "text-stone-500 bg-stone-100" },
};

const ESTADOS_INLINE = {
  pendiente:   { label: "Pendiente",   color: "bg-stone-100 text-stone-600" },
  en_progreso: { label: "En progreso", color: "bg-amber-100 text-amber-700" },
  completada:  { label: "Completada",  color: "bg-emerald-100 text-emerald-700" },
};

function TareaProyectoCard({ tarea }: { tarea: Tarea }) {
  const estadoInfo = ESTADOS_INLINE[tarea.estado];
  const prioInfo = PRIORIDADES[tarea.prioridad];

  function nextEstado() {
    const ciclo: Tarea["estado"][] = ["pendiente", "en_progreso", "completada"];
    const next = ciclo[(ciclo.indexOf(tarea.estado) + 1) % ciclo.length];
    actualizarTarea(tarea.id, { estado: next });
  }

  return (
    <div className="flex items-start gap-3 bg-white border border-stone-100 rounded-xl px-4 py-3 group hover:border-stone-200 transition-colors">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${tarea.estado === "completada" ? "line-through text-stone-400" : "text-stone-800"}`}>
          {tarea.titulo}
        </p>
        {tarea.descripcion && (
          <p className="text-xs text-stone-400 mt-0.5 truncate">{tarea.descripcion}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={nextEstado}
            className={`text-xs font-medium rounded-full px-2 py-0.5 ${estadoInfo.color} hover:opacity-80 transition-opacity`}
          >
            {estadoInfo.label}
          </button>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${prioInfo.color}`}>
            {prioInfo.label}
          </span>
        </div>
      </div>
      <button
        onClick={() => eliminarTarea(tarea.id)}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all shrink-0 mt-0.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function TareasTab({ proyectoId }: { proyectoId: string }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", descripcion: "", prioridad: "media" as Tarea["prioridad"] });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    return escucharTareasDeProyecto(proyectoId, setTareas);
  }, [proyectoId]);

  async function agregar() {
    if (!form.titulo.trim()) return;
    setAdding(true);
    await crearTarea({
      titulo:          form.titulo.trim(),
      descripcion:     form.descripcion.trim(),
      prioridad:       form.prioridad,
      estado:          "pendiente",
      asignado:        "",
      creadoPor:       getNombre(),
      fechaVencimiento: null,
      proyectoId,
    });
    setForm({ titulo: "", descripcion: "", prioridad: "media" });
    setShowForm(false);
    setAdding(false);
  }

  const pendientes  = tareas.filter((t) => t.estado === "pendiente");
  const enProgreso  = tareas.filter((t) => t.estado === "en_progreso");
  const completadas = tareas.filter((t) => t.estado === "completada");

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
          Tareas del proyecto
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva tarea
        </button>
      </div>

      {showForm && (
        <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
          <input
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            placeholder="Título de la tarea…"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white"
            autoFocus
          />
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
            placeholder="Descripción opcional…"
            rows={2}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white resize-none"
          />
          <select
            value={form.prioridad}
            onChange={(e) => setForm((f) => ({ ...f, prioridad: e.target.value as Tarea["prioridad"] }))}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white text-stone-700"
          >
            <option value="alta">Prioridad alta</option>
            <option value="media">Prioridad media</option>
            <option value="baja">Prioridad baja</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setForm({ titulo: "", descripcion: "", prioridad: "media" }); }}
              className="flex-1 border border-stone-200 text-stone-600 rounded-full py-2 text-xs font-medium hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={agregar}
              disabled={adding || !form.titulo.trim()}
              className="flex-1 bg-stone-900 text-white rounded-full py-2 text-xs font-medium hover:bg-stone-700 disabled:opacity-30 transition-colors"
            >
              {adding ? "Guardando…" : "Crear tarea"}
            </button>
          </div>
        </div>
      )}

      {tareas.length === 0 && !showForm && (
        <div className="flex flex-col items-center py-12 text-center">
          <AlertCircle className="w-10 h-10 text-stone-200 mb-3" />
          <p className="text-stone-400 text-sm">Sin tareas para este proyecto.</p>
        </div>
      )}

      {[
        { label: "Pendiente",   items: pendientes },
        { label: "En progreso", items: enProgreso },
        { label: "Completada",  items: completadas },
      ]
        .filter((g) => g.items.length > 0)
        .map((grupo) => (
          <div key={grupo.label}>
            <p className="text-xs font-medium text-stone-400 mb-2">{grupo.label}</p>
            <div className="space-y-2">
              {grupo.items.map((t) => (
                <TareaProyectoCard key={t.id} tarea={t} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
