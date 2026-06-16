"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Search, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { escucharProyectos, eliminarProyecto } from "@/modules/proyectos/queries";
import { estadoBadge, estadoLabel } from "@/modules/proyectos/types";
import type { Proyecto } from "@/modules/proyectos/types";
import { ProyectoModal } from "@/modules/proyectos/components/ProyectoModal";
import { InfoTab } from "@/modules/proyectos/components/InfoTab";
import { ModulosTab } from "@/modules/proyectos/components/ModulosTab";
import { PuntosTab } from "@/modules/proyectos/components/PuntosTab";
import { TareasTab } from "@/modules/proyectos/components/TareasTab";

type Tab = "info" | "modulos" | "puntos" | "tareas";

const TABS: { id: Tab; label: string }[] = [
  { id: "info",    label: "Info general" },
  { id: "modulos", label: "Módulos" },
  { id: "puntos",  label: "Puntos" },
  { id: "tareas",  label: "Tareas" },
];

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    return escucharProyectos(setProyectos);
  }, []);

  const filtrados = proyectos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente.toLowerCase().includes(search.toLowerCase())
  );

  const selected = proyectos.find((p) => p.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId(id);
    setActiveTab("info");
    setConfirmDelete(false);
  }

  async function handleDelete() {
    if (!selected) return;
    await eliminarProyecto(selected.id);
    setSelectedId(null);
    setConfirmDelete(false);
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Panel izquierdo */}
      <aside className="w-64 shrink-0 border-r border-stone-200 flex flex-col">
        <div className="px-4 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <h1 className="font-semibold text-stone-900 text-sm">Proyectos</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-stone-900 text-white rounded-full p-1.5 hover:bg-stone-700 transition-colors"
            title="Nuevo proyecto"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-3 py-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2 bg-stone-100 rounded-lg px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar…"
              className="bg-transparent text-sm text-stone-800 outline-none w-full placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filtrados.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-8 px-4">
              {proyectos.length === 0 ? "No hay proyectos aún." : "Sin resultados para esa búsqueda."}
            </p>
          )}
          {filtrados.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mx-1 mb-0.5 flex items-center justify-between gap-2 transition-colors ${
                selectedId === p.id
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.nombre}</p>
                {p.cliente && <p className="text-xs text-stone-400 truncate">{p.cliente}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${estadoBadge(p.estado)}`}>
                  {estadoLabel(p.estado)}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${selectedId === p.id ? "text-emerald-600" : "text-stone-300"}`} />
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Panel derecho */}
      <div className="flex-1 overflow-y-auto">
        {!selected && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Building2 className="w-12 h-12 text-stone-200 mb-4" />
            <p className="text-stone-400 text-sm font-medium">Selecciona un proyecto</p>
            <p className="text-stone-300 text-xs mt-1">o crea uno nuevo con el botón +</p>
          </div>
        )}

        {selected && (
          <>
            <div className="px-8 pt-8 pb-0 border-b border-stone-100">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-semibold text-stone-900">{selected.nombre}</h2>
                  {(selected.cliente || selected.ubicacion) && (
                    <p className="text-stone-500 text-sm mt-0.5">
                      {[selected.cliente, selected.ubicacion].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <span className={`inline-block mt-2 text-xs font-semibold rounded-full px-2.5 py-1 ${estadoBadge(selected.estado)}`}>
                    {estadoLabel(selected.estado)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-stone-500 border border-stone-200 rounded-full px-3 py-1.5 hover:bg-stone-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  {confirmDelete ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleDelete}
                        className="text-xs font-medium text-white bg-red-500 rounded-full px-3 py-1.5 hover:bg-red-600 transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-xs font-medium text-stone-500 border border-stone-200 rounded-full px-3 py-1.5 hover:bg-stone-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-stone-400 border border-stone-200 rounded-full p-1.5 hover:text-red-400 hover:border-red-200 transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab.id
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 py-7">
              {activeTab === "info"    && <InfoTab    proyecto={selected} />}
              {activeTab === "modulos" && <ModulosTab proyectoId={selected.id} />}
              {activeTab === "puntos"  && <PuntosTab  proyectoId={selected.id} />}
              {activeTab === "tareas"  && <TareasTab  proyectoId={selected.id} />}
            </div>
          </>
        )}
      </div>

      {showModal && <ProyectoModal onClose={() => setShowModal(false)} />}
      {editando && selected && <ProyectoModal proyecto={selected} onClose={() => setEditando(false)} />}
    </div>
  );
}
