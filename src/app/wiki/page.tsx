"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { escucharWiki, eliminarPagina } from "@/modules/wiki/queries";
import { renderMarkdown, formatFechaWiki } from "@/modules/wiki/types";
import type { PaginaWiki } from "@/modules/wiki/types";
import { EditorModal } from "@/modules/wiki/components/EditorModal";

export default function WikiPage() {
  const [paginas, setPaginas] = useState<PaginaWiki[]>([]);
  const [paginaActiva, setPaginaActiva] = useState<PaginaWiki | null>(null);
  const [modal, setModal] = useState<Partial<PaginaWiki> | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");

  useEffect(() => {
    return escucharWiki(setPaginas);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta página?")) return;
    await eliminarPagina(id);
    if (paginaActiva?.id === id) setPaginaActiva(null);
  }

  const categorias = ["Todas", ...Array.from(new Set(paginas.map((p) => p.categoria)))];

  const filtradas = paginas.filter((p) => {
    const matchBusqueda =
      !busqueda ||
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.contenido.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return matchBusqueda && matchCat;
  });

  const porCategoria: Record<string, PaginaWiki[]> = {};
  filtradas.forEach((p) => {
    if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
    porCategoria[p.categoria].push(p);
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 shrink-0 border-r border-stone-200 bg-white flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
              Wiki
            </h1>
            <button
              onClick={() => setModal({})}
              className="p-1.5 rounded-full bg-stone-900 text-white hover:bg-stone-700 transition-colors"
              title="Nueva página"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar…"
            className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:border-stone-400 focus:outline-none"
          />
        </div>

        <div className="px-3 py-2 border-b border-stone-100 flex gap-1 flex-wrap">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoriaFiltro(c)}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                categoriaFiltro === c
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto py-2">
          {filtradas.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-stone-200 mb-2" />
              <p className="text-sm text-stone-400">
                {paginas.length === 0 ? "Crea tu primera página" : "Sin resultados"}
              </p>
            </div>
          ) : (
            Object.entries(porCategoria).map(([cat, ps]) => (
              <div key={cat}>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 px-4 py-2">
                  {cat}
                </p>
                {ps.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaginaActiva(p)}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 group transition-colors ${
                      paginaActiva?.id === p.id ? "bg-stone-100" : "hover:bg-stone-50"
                    }`}
                  >
                    <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
                    <span className="text-sm text-stone-700 truncate">{p.titulo}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-stone-50">
        {paginaActiva ? (
          <div className="max-w-3xl mx-auto px-10 py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setPaginaActiva(null)}
                className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Wiki
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal(paginaActiva)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full hover:border-stone-300 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(paginaActiva.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Eliminar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                {paginaActiva.categoria}
              </span>
              <span className="text-xs text-stone-400">
                Actualizado {formatFechaWiki(paginaActiva.actualizadoEn)}
              </span>
              {paginaActiva.autor && (
                <span className="text-xs text-stone-400">· por {paginaActiva.autor}</span>
              )}
            </div>

            <h1 className="text-3xl text-stone-900 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {paginaActiva.titulo}
            </h1>

            {paginaActiva.contenido ? (
              <div
                className="wiki-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(paginaActiva.contenido) }}
              />
            ) : (
              <p className="text-stone-400 italic">Esta página aún no tiene contenido.</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <BookOpen className="w-12 h-12 mx-auto text-stone-200 mb-4" />
              <h2 className="text-2xl text-stone-300 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Wiki del equipo
              </h2>
              <p className="text-sm text-stone-400 mb-5">
                Documenta procesos, decisiones y guías para todo el equipo.
              </p>
              <button
                onClick={() => setModal({})}
                className="flex items-center gap-2 mx-auto bg-stone-900 text-stone-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear primera página
              </button>
            </div>
          </div>
        )}
      </div>

      {modal !== null && (
        <EditorModal pagina={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
