"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckSquare, Check } from "lucide-react";
import { escucharPuntosProyecto, crearPunto, actualizarPunto, eliminarPunto } from "../queries";
import type { PuntoProyecto } from "../types";

function getNombre() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("milpa_nombre") || "";
}

function PuntoItem({ punto }: { punto: PuntoProyecto }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl px-4 py-3 group transition-colors ${punto.completado ? "bg-stone-50" : "bg-white border border-stone-100"}`}>
      <button
        onClick={() => actualizarPunto(punto.id, { completado: !punto.completado })}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${punto.completado ? "bg-emerald-600 border-emerald-600" : "border-stone-300 hover:border-emerald-400"}`}
      >
        {punto.completado && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${punto.completado ? "line-through text-stone-400" : "text-stone-800"}`}>
          {punto.titulo}
        </p>
        {punto.descripcion && (
          <p className="text-xs text-stone-400 mt-0.5">{punto.descripcion}</p>
        )}
      </div>
      <button
        onClick={() => eliminarPunto(punto.id)}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function PuntosTab({ proyectoId }: { proyectoId: string }) {
  const [puntos, setPuntos] = useState<PuntoProyecto[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    return escucharPuntosProyecto(proyectoId, setPuntos);
  }, [proyectoId]);

  async function agregar() {
    if (!titulo.trim()) return;
    setAdding(true);
    await crearPunto({
      proyectoId,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completado: false,
      creadoPor: getNombre(),
    });
    setTitulo("");
    setDescripcion("");
    setShowForm(false);
    setAdding(false);
  }

  const pendientes = puntos.filter((p) => !p.completado);
  const completados = puntos.filter((p) => p.completado);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
          Puntos del proyecto
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo punto
        </button>
      </div>

      {showForm && (
        <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-stone-50">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del punto…"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white"
            autoFocus
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción opcional…"
            rows={2}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setTitulo(""); setDescripcion(""); }}
              className="flex-1 border border-stone-200 text-stone-600 rounded-full py-2 text-xs font-medium hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={agregar}
              disabled={adding || !titulo.trim()}
              className="flex-1 bg-stone-900 text-white rounded-full py-2 text-xs font-medium hover:bg-stone-700 disabled:opacity-30 transition-colors"
            >
              {adding ? "Guardando…" : "Agregar"}
            </button>
          </div>
        </div>
      )}

      {puntos.length === 0 && !showForm && (
        <div className="flex flex-col items-center py-12 text-center">
          <CheckSquare className="w-10 h-10 text-stone-200 mb-3" />
          <p className="text-stone-400 text-sm">Sin puntos aún. Agrega tareas clave, hitos o notas.</p>
        </div>
      )}

      <div className="space-y-2">
        {pendientes.map((p) => <PuntoItem key={p.id} punto={p} />)}
        {completados.length > 0 && pendientes.length > 0 && (
          <p className="text-xs text-stone-400 font-medium pt-2 pb-1">Completados</p>
        )}
        {completados.map((p) => <PuntoItem key={p.id} punto={p} />)}
      </div>
    </div>
  );
}
