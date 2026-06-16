-- 003_wiki.sql
-- Módulo: Wiki

create table if not exists wiki (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null,
  contenido     text not null default '',
  categoria     text not null default 'General',
  autor         text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger wiki_updated_at
  before update on wiki
  for each row execute function set_updated_at();

create index if not exists wiki_categoria_idx on wiki(categoria);
