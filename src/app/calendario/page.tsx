"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { escucharTareas } from "@/modules/tareas/queries";
import { MESES, DIAS_SEMANA, toKey, todayKey } from "@/modules/calendario/types";
import type { Tarea } from "@/modules/tareas/types";

const PRIORIDAD_DOT: Record<Tarea["prioridad"], string> = {
  alta:  "bg-red-400",
  media: "bg-amber-400",
  baja:  "bg-emerald-500",
};

export default function CalendarioPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [hoy] = useState(() => new Date());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(todayKey());

  useEffect(() => {
    return escucharTareas(setTareas);
  }, []);

  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  const startDow = (primerDia.getDay() + 6) % 7;
  const totalCeldas = Math.ceil((startDow + ultimoDia.getDate()) / 7) * 7;

  const celdas: (number | null)[] = [];
  for (let i = 0; i < totalCeldas; i++) {
    const d = i - startDow + 1;
    celdas.push(d >= 1 && d <= ultimoDia.getDate() ? d : null);
  }

  const tareasPorDia: Record<string, Tarea[]> = {};
  tareas.forEach((t) => {
    if (t.fechaVencimiento) {
      if (!tareasPorDia[t.fechaVencimiento]) tareasPorDia[t.fechaVencimiento] = [];
      tareasPorDia[t.fechaVencimiento].push(t);
    }
  });

  function prevMes() {
    if (mes === 0) { setAnio(anio - 1); setMes(11); }
    else setMes(mes - 1);
  }

  function nextMes() {
    if (mes === 11) { setAnio(anio + 1); setMes(0); }
    else setMes(mes + 1);
  }

  const today = todayKey();
  const tareasDelDia = diaSeleccionado ? (tareasPorDia[diaSeleccionado] ?? []) : [];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl text-stone-900" style={{ fontFamily: "var(--font-display)" }}>
          Calendario
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setAnio(hoy.getFullYear()); setMes(hoy.getMonth()); setDiaSeleccionado(todayKey()); }}
            className="text-xs font-semibold text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full hover:border-stone-300 transition-colors"
          >
            Hoy
          </button>
          <div className="flex items-center gap-1">
            <button onClick={prevMes} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-stone-500" />
            </button>
            <span className="text-sm font-semibold text-stone-900 min-w-32 text-center">
              {MESES[mes]} {anio}
            </span>
            <button onClick={nextMes} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-stone-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-7 mb-2">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="text-xs font-bold text-stone-400 uppercase tracking-widest text-center py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((dia, i) => {
              if (dia === null) return <div key={`empty-${i}`} className="rounded-xl aspect-[1/1.1]" />;
              const key = toKey(anio, mes, dia);
              const ts = tareasPorDia[key] ?? [];
              const isToday = key === today;
              const isSelected = key === diaSeleccionado;
              const tieneVencidas = ts.some(
                (t) => t.estado !== "completada" && new Date(t.fechaVencimiento!) < new Date(today)
              );

              return (
                <button
                  key={key}
                  onClick={() => setDiaSeleccionado(key)}
                  className={`relative rounded-xl aspect-[1/1.1] p-2 text-left flex flex-col transition-all ${
                    isSelected
                      ? "bg-stone-900 text-stone-50"
                      : isToday
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-white border border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <span className={`text-sm font-bold leading-none ${
                    isSelected ? "text-stone-50" : isToday ? "text-emerald-700" : "text-stone-900"
                  }`}>
                    {dia}
                  </span>
                  {ts.length > 0 && (
                    <div className="mt-auto flex items-center gap-0.5 flex-wrap">
                      {ts.slice(0, 4).map((t) => (
                        <span
                          key={t.id}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-stone-400" : PRIORIDAD_DOT[t.prioridad]}`}
                        />
                      ))}
                      {ts.length > 4 && (
                        <span className="text-xs font-bold text-stone-400">+{ts.length - 4}</span>
                      )}
                    </div>
                  )}
                  {tieneVencidas && !isSelected && (
                    <AlertCircle className="absolute top-1.5 right-1.5 w-3 h-3 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-72 shrink-0 border-l border-stone-200 bg-white overflow-auto p-5">
          {diaSeleccionado ? (
            <>
              <h2 className="text-lg text-stone-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {(() => {
                  const [y, m, d] = diaSeleccionado.split("-").map(Number);
                  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });
                })()}
              </h2>
              <p className="text-xs text-stone-400 mb-4 font-medium">
                {tareasDelDia.length === 0
                  ? "Sin tareas para este día"
                  : `${tareasDelDia.length} tarea${tareasDelDia.length > 1 ? "s" : ""}`}
              </p>
              {tareasDelDia.length === 0 ? (
                <div className="text-center py-8 text-stone-300">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin vencimientos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tareasDelDia.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-xl p-3 border ${
                        t.estado === "completada"
                          ? "bg-stone-50 border-stone-200 opacity-60"
                          : "bg-white border-stone-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${PRIORIDAD_DOT[t.prioridad]}`} />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-snug ${
                            t.estado === "completada" ? "line-through text-stone-400" : "text-stone-900"
                          }`}>
                            {t.titulo}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              t.estado === "completada"
                                ? "bg-emerald-50 text-emerald-600"
                                : t.estado === "en_progreso"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {t.estado === "completada" ? "Completada" : t.estado === "en_progreso" ? "En progreso" : "Pendiente"}
                            </span>
                            {t.asignado && (
                              <span className="text-xs text-stone-400">{t.asignado}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-stone-400 text-center pt-10">Selecciona un día</p>
          )}
        </div>
      </div>
    </div>
  );
}
