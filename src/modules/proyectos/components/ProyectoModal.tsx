"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { crearProyecto, actualizarProyecto } from "../queries";
import { ESTADOS_PROYECTO } from "../types";
import type { Proyecto } from "../types";

function getNombre() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("milpa_nombre") || "";
}

interface Props {
  proyecto?: Proyecto | null;
  onClose: () => void;
}

export function ProyectoModal({ proyecto, onClose }: Props) {
  const [form, setForm] = useState({
    nombre:      proyecto?.nombre      ?? "",
    cliente:     proyecto?.cliente     ?? "",
    ubicacion:   proyecto?.ubicacion   ?? "",
    industria:   proyecto?.industria   ?? "",
    descripcion: proyecto?.descripcion ?? "",
    estado:      proyecto?.estado      ?? ("en_desarrollo" as Proyecto["estado"]),
  });
  const [saving, setSaving] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      if (proyecto) {
        await actualizarProyecto(proyecto.id, form);
      } else {
        await crearProyecto({ ...form, creadoPor: getNombre() });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">
            {proyecto ? "Editar proyecto" : "Nuevo proyecto"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
              Nombre del proyecto *
            </label>
            <input
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej. Sprachenmehr e.V."
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
                Cliente
              </label>
              <input
                value={form.cliente}
                onChange={(e) => set("cliente", e.target.value)}
                placeholder="Empresa o persona"
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
                Ubicación
              </label>
              <input
                value={form.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
                placeholder="Ciudad, País"
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
                Industria
              </label>
              <input
                value={form.industria}
                onChange={(e) => set("industria", e.target.value)}
                placeholder="Ej. Educación"
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) => set("estado", e.target.value as Proyecto["estado"])}
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
              >
                {ESTADOS_PROYECTO.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="¿De qué trata este proyecto?"
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-600 rounded-full py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.nombre.trim()}
              className="flex-1 bg-stone-900 text-stone-50 rounded-full py-2.5 text-sm font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors"
            >
              {saving ? "Guardando…" : proyecto ? "Guardar cambios" : "Crear proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
