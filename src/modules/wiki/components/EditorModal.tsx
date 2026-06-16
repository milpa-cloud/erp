"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { crearPagina, actualizarPagina } from "../queries";
import { CATEGORIAS_WIKI, renderMarkdown } from "../types";
import type { PaginaWiki } from "../types";

interface Props {
  pagina: Partial<PaginaWiki> | null;
  onClose: () => void;
}

export function EditorModal({ pagina, onClose }: Props) {
  const editando = Boolean(pagina?.id);
  const [titulo, setTitulo] = useState(pagina?.titulo ?? "");
  const [contenido, setContenido] = useState(pagina?.contenido ?? "");
  const [categoria, setCategoria] = useState(pagina?.categoria ?? "General");
  const [preview, setPreview] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    if (!titulo.trim()) return;
    setGuardando(true);
    const autor = localStorage.getItem("milpa_nombre") || "Equipo";
    const data = { titulo: titulo.trim(), contenido, categoria, autor };
    if (editando && pagina?.id) {
      await actualizarPagina(pagina.id, data);
    } else {
      await crearPagina(data);
    }
    setGuardando(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100 shrink-0">
          <h2 className="text-xl text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
            {editando ? "Editar página" : "Nueva página"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                preview
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              {preview ? "Editar" : "Vista previa"}
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Título *
              </label>
              <input
                autoFocus
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Nombre de la página…"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1.5">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:border-stone-900 focus:outline-none bg-white"
              >
                {CATEGORIAS_WIKI.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                Contenido
              </label>
              <span className="text-xs text-stone-400">Soporta Markdown básico</span>
            </div>
            {preview ? (
              <div
                className="wiki-content min-h-64 border border-stone-200 rounded-xl p-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(contenido) }}
              />
            ) : (
              <textarea
                rows={18}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder={`# Título\n\nEscribe el contenido aquí…\n\n## Sección\n\nUsa **negrita**, *itálica*, \`código\` y listas:\n- elemento 1\n- elemento 2`}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm font-mono text-stone-800 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none resize-none transition-colors leading-relaxed"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5 shrink-0 border-t border-stone-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-semibold text-stone-500 border border-stone-200 hover:border-stone-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={!titulo.trim() || guardando}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-stone-900 text-stone-50 hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
