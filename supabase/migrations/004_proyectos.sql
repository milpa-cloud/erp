-- 004_proyectos.sql
-- Módulo: Proyectos (debe correrse ANTES de 002_tareas.sql que referencia proyectos.id)

create table if not exists proyectos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  cliente     text not null default '',
  ubicacion   text not null default '',
  industria   text not null default '',
  descripcion text not null default '',
  estado      text not null default 'en_desarrollo'
                check (estado in ('activo', 'en_desarrollo', 'completado', 'pausado')),
  creado_por  text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger proyectos_updated_at
  before update on proyectos
  for each row execute function set_updated_at();

-- Puntos de proyecto (checklist)
create table if not exists puntos_proyecto (
  id          uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyectos(id) on delete cascade,
  titulo      text not null,
  descripcion text not null default '',
  completado  boolean not null default false,
  creado_por  text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists puntos_proyecto_id_idx on puntos_proyecto(proyecto_id);

-- Módulos requeridos por proyecto
create table if not exists modulos_proyecto (
  id          uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyectos(id) on delete cascade,
  nombre      text not null,
  descripcion text not null default '',
  estado      text not null default 'pendiente'
                check (estado in ('pendiente', 'en_desarrollo', 'completado'))
);

create index if not exists modulos_proyecto_id_idx on modulos_proyecto(proyecto_id);
