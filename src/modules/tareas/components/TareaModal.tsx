"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { crearTarea, actualizarTarea } from "../queries";
import { ESTADOS_TAREA, PRIORIDADES_TAREA } from "../types";
import type { Tarea } from "../types";

interface Props {
  tarea: Partial<Tarea> | null;
  onClose: () => void;
}

export function TareaModal({ tarea, onClose }: Props) {
  const editando = Boolean(tarea?.id);
  const [titulo, setTitulo] = useState(tarea?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? "");
  const [asignado, setAsignado] = useState(tarea?.asignado ?? "");
  const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>(tarea?.prioridad ?? "media");
  const [estado, setEstado] = useState<Tarea["estado"]>(tarea?.estado ?? "pendiente");
  const [fechaVencimiento, setFechaVencimiento] = useState(tarea?.fechaVencimiento ?? "");
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    if (!titulo.trim()) return;
    setGuardando(true);
    const nombre = localStorage.getItem("milpa_nombre") || "Equipo";
    const data = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      asignado: asignado.trim(),
      prioridad,
      estado,
      fechaVencimiento: fechaVencimiento || null,
      creadoPor: nombre,
    };
    if (editando && tarea?.id) {
      await actualizarTarea(tarea.id, data);
    } else {
      await crearTarea(data);
    }
    setGuardando(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <h2 className="text-xl text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            {editando ? "Editar tarea" : "Nueva tarea"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
              Título *
            </label>
            <input
              autoFocus
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Qué hay que hacer?"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
              Descripción
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles opcionales…"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Asignado a
              </label>
              <input
                type="text"
                value={asignado}
                onChange={(e) => setAsignado(e.target.value)}
                placeholder="Nombre…"
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Fecha límite
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
              Prioridad
            </label>
            <div className="flex gap-2">
              {PRIORIDADES_TAREA.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPrioridad(p.key)}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                    prioridad === p.key
                      ? p.cls + " ring-2 ring-offset-1 ring-stone-300"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
              Estado
            </label>
            <div className="flex gap-2">
              {ESTADOS_TAREA.map((e) => (
                <button
                  key={e.key}
                  onClick={() => setEstado(e.key)}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                    estado === e.key
                      ? "bg-stone-900 text-stone-50"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold text-stone-500 border border-stone-200 hover:border-stone-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={!titulo.trim() || guardando}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-stone-900 text-stone-50 hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear tarea"}
          </button>
        </div>
      </div>
    </div>
  );
}
