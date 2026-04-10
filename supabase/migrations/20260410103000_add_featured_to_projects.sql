alter table public.projects
add column if not exists is_featured boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from public.projects
    where is_featured = true
  ) then
    with ranked_projects as (
      select id,
             row_number() over (order by sort_order asc, created_at asc) as row_num
      from public.projects
      where is_published = true
    )
    update public.projects as projects
    set is_featured = true
    from ranked_projects
    where projects.id = ranked_projects.id
      and ranked_projects.row_num <= 3;
  end if;
end $$;
