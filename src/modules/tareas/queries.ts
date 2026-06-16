import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, where, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Tarea } from "./types";

export function escucharTareas(callback: (tareas: Tarea[]) => void) {
  const q = query(collection(db, "tareas"), orderBy("creadoEn", "desc"));
  return onSnapshot(q, (snap) => {
    const tareas: Tarea[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titulo: data.titulo ?? "",
        descripcion: data.descripcion ?? "",
        estado: data.estado ?? "pendiente",
        prioridad: data.prioridad ?? "media",
        asignado: data.asignado ?? "",
        creadoPor: data.creadoPor ?? "",
        fechaVencimiento: data.fechaVencimiento ?? null,
        proyectoId: data.proyectoId ?? null,
        creadoEn:
          data.creadoEn instanceof Timestamp
            ? data.creadoEn.toDate().toISOString()
            : data.creadoEn ?? new Date().toISOString(),
      };
    });
    callback(tareas);
  });
}

export function escucharTareasDeProyecto(proyectoId: string, callback: (tareas: Tarea[]) => void) {
  const q = query(collection(db, "tareas"), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const tareas: Tarea[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titulo: data.titulo ?? "",
        descripcion: data.descripcion ?? "",
        estado: data.estado ?? "pendiente",
        prioridad: data.prioridad ?? "media",
        asignado: data.asignado ?? "",
        creadoPor: data.creadoPor ?? "",
        fechaVencimiento: data.fechaVencimiento ?? null,
        proyectoId: data.proyectoId ?? null,
        creadoEn:
          data.creadoEn instanceof Timestamp
            ? data.creadoEn.toDate().toISOString()
            : data.creadoEn ?? new Date().toISOString(),
      };
    });
    tareas.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
    callback(tareas);
  });
}

export async function crearTarea(data: Omit<Tarea, "id" | "creadoEn">) {
  await addDoc(collection(db, "tareas"), { ...data, creadoEn: serverTimestamp() });
}

export async function actualizarTarea(id: string, data: Partial<Omit<Tarea, "id">>) {
  await updateDoc(doc(db, "tareas", id), data);
}

export async function eliminarTarea(id: string) {
  await deleteDoc(doc(db, "tareas", id));
}
