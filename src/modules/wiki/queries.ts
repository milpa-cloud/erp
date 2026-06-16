import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PaginaWiki } from "./types";

export function escucharWiki(callback: (paginas: PaginaWiki[]) => void) {
  const q = query(collection(db, "wiki"), orderBy("actualizadoEn", "desc"));
  return onSnapshot(q, (snap) => {
    const paginas: PaginaWiki[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titulo: (data.titulo as string) ?? "",
        contenido: (data.contenido as string) ?? "",
        categoria: (data.categoria as string) ?? "General",
        autor: (data.autor as string) ?? "",
        actualizadoEn:
          data.actualizadoEn instanceof Timestamp
            ? data.actualizadoEn.toDate().toISOString()
            : ((data.actualizadoEn as string) ?? new Date().toISOString()),
      };
    });
    callback(paginas);
  });
}

export async function crearPagina(data: Omit<PaginaWiki, "id" | "actualizadoEn">) {
  await addDoc(collection(db, "wiki"), { ...data, actualizadoEn: serverTimestamp() });
}

export async function actualizarPagina(id: string, data: Partial<Omit<PaginaWiki, "id">>) {
  await updateDoc(doc(db, "wiki", id), { ...data, actualizadoEn: serverTimestamp() });
}

export async function eliminarPagina(id: string) {
  await deleteDoc(doc(db, "wiki", id));
}
