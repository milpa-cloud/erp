"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { escucharModulosProyecto, crearModulo, actualizarModulo, eliminarModulo } from "../queries";
import { ESTADOS_MODULO, MODULOS_SUGERIDOS } from "../types";
import type { ModuloProyecto } from "../types";

export function ModulosTab({ proyectoId }: { proyectoId: string }) {
  const [modulos, setModulos] = useState<ModuloProyecto[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [sugerencia, setSugerencia] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    return escucharModulosProyecto(proyectoId, setModulos);
  }, [proyectoId]);

  async function agregar() {
    const nombre = (sugerencia || nuevoNombre).trim();
    if (!nombre) return;
    setAdding(true);
    await crearModulo({ proyectoId, nombre, descripcion: "", estado: "pendiente" });
    setNuevoNombre("");
    setSugerencia("");
    setAdding(false);
  }

  async function toggleEstado(modulo: ModuloProyecto) {
    const ciclo: ModuloProyecto["estado"][] = ["pendiente", "en_desarrollo", "completado"];
    const next = ciclo[(ciclo.indexOf(modulo.estado) + 1) % ciclo.length];
    await actualizarModulo(modulo.id, { estado: next });
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">
        Módulos requeridos
      </p>

      <div className="flex gap-2">
        <select
          value={sugerencia}
          onChange={(e) => { setSugerencia(e.target.value); setNuevoNombre(""); }}
          className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white text-stone-700"
        >
          <option value="">Elegir módulo sugerido…</option>
          {MODULOS_SUGERIDOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <span className="text-stone-300 self-center text-xs">o</span>
        <input
          value={nuevoNombre}
          onChange={(e) => { setNuevoNombre(e.target.value); setSugerencia(""); }}
          placeholder="Módulo personalizado…"
          className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500"
          onKeyDown={(e) => e.key === "Enter" && agregar()}
        />
        <button
          onClick={agregar}
          disabled={adding || (!nuevoNombre.trim() && !sugerencia)}
          className="bg-stone-900 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-stone-700 disabled:opacity-30 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {modulos.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <Package className="w-10 h-10 text-stone-200 mb-3" />
          <p className="text-stone-400 text-sm">Sin módulos aún. Agrega los que necesita este proyecto.</p>
        </div>
      )}
      <div className="space-y-2">
        {modulos.map((m) => {
          const est = ESTADOS_MODULO[m.estado];
          return (
            <div key={m.id} className="flex items-center gap-3 bg-stone-50 rounded-xl px-4 py-3 group">
              <button
                onClick={() => toggleEstado(m)}
                title={`Estado: ${est.label} — clic para cambiar`}
                className="flex items-center gap-1.5 shrink-0"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${est.dot}`} />
                <span className="text-xs text-stone-400 w-24 text-left">{est.label}</span>
              </button>
              <span className="flex-1 text-sm text-stone-800 font-medium">{m.nombre}</span>
              <button
                onClick={() => eliminarModulo(m.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
