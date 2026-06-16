-- 001_core_schema.sql
-- Schema base: extensiones y funciones utilitarias compartidas.
-- Correr primero, antes de cualquier migración de módulo.

-- UUID generation
create extension if not exists "pgcrypto";

-- Función para actualizar updated_at automáticamente
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
