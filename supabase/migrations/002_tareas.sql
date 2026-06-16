-- 002_tareas.sql
-- Módulo: Tareas

create table if not exists tareas (
  id               uuid primary key default gen_random_uuid(),
  titulo           text not null,
  descripcion      text not null default '',
  estado           text not null default 'pendiente'
                     check (estado in ('pendiente', 'en_progreso', 'completada')),
  prioridad        text not null default 'media'
                     check (prioridad in ('alta', 'media', 'baja')),
  asignado         text not null default '',
  creado_por       text not null default '',
  fecha_vencimiento date,
  proyecto_id      uuid references proyectos(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger tareas_updated_at
  before update on tareas
  for each row execute function set_updated_at();

-- Índice para filtrar por proyecto
create index if not exists tareas_proyecto_id_idx on tareas(proyecto_id);
create index if not exists tareas_estado_idx on tareas(estado);
