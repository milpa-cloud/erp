import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, where, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Proyecto, PuntoProyecto, ModuloProyecto } from "./types";

// — Proyectos —

export function escucharProyectos(callback: (proyectos: Proyecto[]) => void) {
  const q = query(collection(db, "proyectos"), orderBy("creadoEn", "desc"));
  return onSnapshot(q, (snap) => {
    const proyectos: Proyecto[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nombre: (data.nombre as string) ?? "",
        cliente: (data.cliente as string) ?? "",
        ubicacion: (data.ubicacion as string) ?? "",
        industria: (data.industria as string) ?? "",
        descripcion: (data.descripcion as string) ?? "",
        estado: (data.estado as Proyecto["estado"]) ?? "activo",
        creadoPor: (data.creadoPor as string) ?? "",
        creadoEn:
          data.creadoEn instanceof Timestamp
            ? data.creadoEn.toDate().toISOString()
            : ((data.creadoEn as string) ?? new Date().toISOString()),
      };
    });
    callback(proyectos);
  });
}

export async function crearProyecto(data: Omit<Proyecto, "id" | "creadoEn">) {
  await addDoc(collection(db, "proyectos"), { ...data, creadoEn: serverTimestamp() });
}

export async function actualizarProyecto(id: string, data: Partial<Omit<Proyecto, "id">>) {
  await updateDoc(doc(db, "proyectos", id), data);
}

export async function eliminarProyecto(id: string) {
  await deleteDoc(doc(db, "proyectos", id));
}

// — Puntos de proyecto —

export function escucharPuntosProyecto(proyectoId: string, callback: (puntos: PuntoProyecto[]) => void) {
  const q = query(collection(db, "puntos_proyecto"), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const puntos: PuntoProyecto[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        proyectoId: (data.proyectoId as string) ?? "",
        titulo: (data.titulo as string) ?? "",
        descripcion: (data.descripcion as string) ?? "",
        completado: (data.completado as boolean) ?? false,
        creadoPor: (data.creadoPor as string) ?? "",
        creadoEn:
          data.creadoEn instanceof Timestamp
            ? data.creadoEn.toDate().toISOString()
            : ((data.creadoEn as string) ?? new Date().toISOString()),
      };
    });
    puntos.sort((a, b) => a.creadoEn.localeCompare(b.creadoEn));
    callback(puntos);
  });
}

export async function crearPunto(data: Omit<PuntoProyecto, "id" | "creadoEn">) {
  await addDoc(collection(db, "puntos_proyecto"), { ...data, creadoEn: serverTimestamp() });
}

export async function actualizarPunto(id: string, data: Partial<Omit<PuntoProyecto, "id">>) {
  await updateDoc(doc(db, "puntos_proyecto", id), data);
}

export async function eliminarPunto(id: string) {
  await deleteDoc(doc(db, "puntos_proyecto", id));
}

// — Módulos de proyecto —

export function escucharModulosProyecto(proyectoId: string, callback: (modulos: ModuloProyecto[]) => void) {
  const q = query(collection(db, "modulos_proyecto"), where("proyectoId", "==", proyectoId));
  return onSnapshot(q, (snap) => {
    const modulos: ModuloProyecto[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        proyectoId: (data.proyectoId as string) ?? "",
        nombre: (data.nombre as string) ?? "",
        descripcion: (data.descripcion as string) ?? "",
        estado: (data.estado as ModuloProyecto["estado"]) ?? "pendiente",
      };
    });
    callback(modulos);
  });
}

export async function crearModulo(data: Omit<ModuloProyecto, "id">) {
  await addDoc(collection(db, "modulos_proyecto"), data);
}

export async function actualizarModulo(id: string, data: Partial<Omit<ModuloProyecto, "id">>) {
  await updateDoc(doc(db, "modulos_proyecto", id), data);
}

export async function eliminarModulo(id: string) {
  await deleteDoc(doc(db, "modulos_proyecto", id));
}
