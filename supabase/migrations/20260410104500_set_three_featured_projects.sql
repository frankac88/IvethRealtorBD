with ranked_projects as (
  select id,
         row_number() over (order by sort_order asc, created_at asc) as row_num
  from public.projects
  where is_published = true
)
update public.projects as projects
set is_featured = ranked_projects.row_num <= 3
from ranked_projects
where projects.id = ranked_projects.id;

update public.projects
set is_featured = false
where is_published = false;
