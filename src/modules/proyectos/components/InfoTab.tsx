"use client";

import { Info } from "lucide-react";
import type { Proyecto } from "../types";

export function InfoTab({ proyecto }: { proyecto: Proyecto }) {
  const campos = [
    { label: "Cliente",    value: proyecto.cliente },
    { label: "Ubicación",  value: proyecto.ubicacion },
    { label: "Industria",  value: proyecto.industria },
  ].filter((c) => c.value);

  return (
    <div className="space-y-6 max-w-2xl">
      {campos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {campos.map((c) => (
            <div key={c.label} className="bg-stone-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
                {c.label}
              </p>
              <p className="text-stone-900 font-medium text-sm">{c.value}</p>
            </div>
          ))}
        </div>
      )}
      {proyecto.descripcion && (
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">
            Descripción
          </p>
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
            {proyecto.descripcion}
          </p>
        </div>
      )}
      {!proyecto.descripcion && campos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Info className="w-10 h-10 text-stone-200 mb-3" />
          <p className="text-stone-400 text-sm">Sin información. Edita el proyecto para agregar detalles.</p>
        </div>
      )}
    </div>
  );
}
