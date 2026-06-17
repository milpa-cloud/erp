export interface PaginaWiki {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  actualizadoEn: string;
  autor: string;
}

export const CATEGORIAS_WIKI = [
  "Visión",
  "Negocio",
  "Técnico",
  "Producto",
  "Operaciones",
  "Clientes",
  "Guías",
];

export function renderMarkdown(md: string): string {
  if (md.trimStart().startsWith("<")) return md;
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hbpuol])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

export function formatFechaWiki(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
