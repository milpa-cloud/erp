"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User, ExternalLink } from "lucide-react";
import { config } from "../../milpa.config";
import { MODULE_REGISTRY } from "@/modules/registry";

const nav = config.modulos.map((slug) => MODULE_REGISTRY[slug]).filter(Boolean);

function LogoMark({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x={0}  y={7}  width={4} height={11} rx={2} fill={color} />
      <rect x={7}  y={0}  width={4} height={18} rx={2} fill={color} />
      <rect x={14} y={11} width={4} height={7}  rx={2} fill={color} />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    setNombre(localStorage.getItem("milpa_nombre") || "");
  }, []);

  function handleNombre(v: string) {
    setNombre(v);
    localStorage.setItem("milpa_nombre", v);
  }

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-stone-900 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <LogoMark size={18} color="#fafaf9" />
          <span
            className="text-stone-50 text-xl leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            milpa
          </span>
        </div>
        <p className="text-stone-500 text-xs mt-1 font-medium tracking-widest uppercase">
          Equipo
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-600 text-white"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to landing */}
      <div className="px-3 pb-2">
        <a
          href="https://milpa.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          milpa.cloud
        </a>
      </div>

      {/* User */}
      <div className="px-3 py-4 border-t border-stone-700">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2 px-1">
          Mi nombre
        </p>
        <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-2.5 py-1.5">
          <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <input
            type="text"
            value={nombre}
            onChange={(e) => handleNombre(e.target.value)}
            placeholder="Tu nombre…"
            className="bg-transparent text-stone-200 text-sm w-full outline-none placeholder:text-stone-600"
          />
        </div>
      </div>
    </aside>
  );
}
