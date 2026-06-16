// El módulo Calendario no tiene sus propios listeners de Firestore.
// Consume los datos de tareas a través del módulo de Tareas.
// Si en el futuro se agregan eventos propios, este archivo es el lugar.

export { escucharTareas } from "@/modules/tareas/queries";
