create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  badge_es text not null,
  badge_en text not null,
  location_es text not null,
  location_en text not null,
  residences_es text not null,
  residences_en text not null,
  baths_es text not null,
  baths_en text not null,
  type_es text not null,
  type_en text not null,
  delivery_es text not null,
  delivery_en text not null,
  ideal_for_es text not null,
  ideal_for_en text not null,
  parking_es text,
  parking_en text,
  hook_es text not null,
  hook_en text not null,
  filter_location_es text not null,
  filter_location_en text not null,
  filter_type_es text not null,
  filter_type_en text not null,
  filter_strategy_es text not null,
  filter_strategy_en text not null,
  image_url text not null,
  image_path text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists projects_sort_order_idx
  on public.projects (sort_order, created_at);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects
  for select
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects
  for select
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated users can upload project images" on storage.objects;
create policy "Authenticated users can upload project images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users can update project images" on storage.objects;
create policy "Authenticated users can update project images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users can delete project images" on storage.objects;
create policy "Authenticated users can delete project images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images');
