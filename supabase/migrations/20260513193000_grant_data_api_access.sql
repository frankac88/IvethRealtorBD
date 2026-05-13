grant select
  on table public.projects
  to anon;

grant select, insert, update, delete
  on table public.projects
  to authenticated;

grant select, insert, update, delete
  on table public.projects
  to service_role;

grant select
  on table public.leads
  to authenticated;

grant select, insert
  on table public.leads
  to service_role;
