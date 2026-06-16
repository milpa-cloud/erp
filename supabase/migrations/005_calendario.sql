-- 005_calendario.sql
-- Módulo: Calendario
-- Este módulo no tiene tablas propias. Consume la tabla `tareas` (002_tareas.sql).
-- Archivo placeholder para mantener la convención de numeración.

-- Índice útil para el calendario: buscar tareas por fecha de vencimiento
create index if not exists tareas_fecha_vencimiento_idx on tareas(fecha_vencimiento)
  where fecha_vencimiento is not null;
