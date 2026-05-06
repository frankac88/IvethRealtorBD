alter table public.projects
  add column if not exists city text not null default 'miami'
    check (city in ('miami', 'orlando')),
  add column if not exists gallery_images jsonb not null default '[]'::jsonb;

update public.projects
set city = case
  when lower(location_es) like '%orlando%'
    or lower(location_es) like '%kissimmee%'
    or lower(location_en) like '%orlando%'
    or lower(location_en) like '%kissimmee%'
    then 'orlando'
  else 'miami'
end
where city is null or city = 'miami';

create index if not exists projects_city_idx
  on public.projects (city, sort_order, created_at);

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/edge-house-pool-deck.webp',
    'path', 'projects/edge-house-pool-deck.webp',
    'labelEs', 'Amenidad',
    'labelEn', 'Amenity'
  ),
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/edge-house-living-room.webp',
    'path', 'projects/edge-house-living-room.webp',
    'labelEs', 'Interior',
    'labelEn', 'Interior'
  ),
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/edge-house-aerial-night.webp',
    'path', 'projects/edge-house-aerial-night.webp',
    'labelEs', 'Vista',
    'labelEn', 'View'
  )
)
where title = 'EDGE HOUSE';

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/bloom-apartment.webp',
    'path', 'projects/bloom-apartment.webp',
    'labelEs', 'Interior',
    'labelEn', 'Interior'
  ),
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/bloom-lobby.webp',
    'path', 'projects/bloom-lobby.webp',
    'labelEs', 'Lobby',
    'labelEn', 'Lobby'
  ),
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/bloom-rooftop-bbq.webp',
    'path', 'projects/bloom-rooftop-bbq.webp',
    'labelEs', 'Rooftop',
    'labelEn', 'Rooftop'
  ),
  jsonb_build_object(
    'url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/bloom-project-view.webp',
    'path', 'projects/bloom-project-view.webp',
    'labelEs', 'Vista del proyecto',
    'labelEn', 'Project view'
  )
)
where title = 'BLOOM NORTH MIAMI';

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/the-william-exterior.webp', 'path', 'projects/the-william-exterior.webp', 'labelEs', 'Exterior', 'labelEn', 'Exterior'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/the-william-living-room.webp', 'path', 'projects/the-william-living-room.webp', 'labelEs', 'Interior', 'labelEn', 'Interior'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/the-william-lobby.webp', 'path', 'projects/the-william-lobby.webp', 'labelEs', 'Lobby', 'labelEn', 'Lobby'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/the-william-pool.webp', 'path', 'projects/the-william-pool.webp', 'labelEs', 'Piscina', 'labelEn', 'Pool'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/the-william-terrace.webp', 'path', 'projects/the-william-terrace.webp', 'labelEs', 'Terraza', 'labelEn', 'Terrace')
)
where title = 'THE WILLIAM RESIDENCES';

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/hotel-arrival.webp', 'path', 'projects/mandarin-oriental-residences/hotel-arrival.webp', 'labelEs', 'Llegada hotel', 'labelEn', 'Hotel arrival'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/all-day-dining-skyline-seating.webp', 'path', 'projects/mandarin-oriental-residences/all-day-dining-skyline-seating.webp', 'labelEs', 'Dining skyline', 'labelEn', 'Skyline dining'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/garden-cabanas.webp', 'path', 'projects/mandarin-oriental-residences/garden-cabanas.webp', 'labelEs', 'Cabanas jardín', 'labelEn', 'Garden cabanas'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/kitchen-residence-warm-palette.webp', 'path', 'projects/mandarin-oriental-residences/kitchen-residence-warm-palette.webp', 'labelEs', 'Cocina residencia', 'labelEn', 'Residence kitchen'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/private-residential-lobby.webp', 'path', 'projects/mandarin-oriental-residences/private-residential-lobby.webp', 'labelEs', 'Lobby privado', 'labelEn', 'Private lobby'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/private-residence.webp', 'path', 'projects/mandarin-oriental-residences/private-residence.webp', 'labelEs', 'Residencia privada', 'labelEn', 'Private residence'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/mandarin-oriental-residences/residence-bathroom.webp', 'path', 'projects/mandarin-oriental-residences/residence-bathroom.webp', 'labelEs', 'Baño residencia', 'labelEn', 'Residence bathroom')
)
where title = 'MANDARIN ORIENTAL RESIDENCES';

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-city-hero-sunset.webp', 'path', 'projects/house-of-wellness/exterior-city-hero-sunset.webp', 'labelEs', 'Skyline atardecer', 'labelEn', 'Sunset skyline'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-city-hero-sunset-alt.webp', 'path', 'projects/house-of-wellness/exterior-city-hero-sunset-alt.webp', 'labelEs', 'Vista ciudad', 'labelEn', 'City view'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-facade-groundview.webp', 'path', 'projects/house-of-wellness/exterior-facade-groundview.webp', 'labelEs', 'Acceso', 'labelEn', 'Ground view'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-hero-daytime.webp', 'path', 'projects/house-of-wellness/exterior-hero-daytime.webp', 'labelEs', 'Fachada diurna', 'labelEn', 'Daytime facade'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-pool-city-view.webp', 'path', 'projects/house-of-wellness/exterior-pool-city-view.webp', 'labelEs', 'Piscina', 'labelEn', 'Pool'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/exterior-rooftop-bayview-daytime.webp', 'path', 'projects/house-of-wellness/exterior-rooftop-bayview-daytime.webp', 'labelEs', 'Rooftop', 'labelEn', 'Rooftop'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/interior-unit-a1.webp', 'path', 'projects/house-of-wellness/interior-unit-a1.webp', 'labelEs', 'Interior', 'labelEn', 'Interior'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/interior-unit-balcony-b5.webp', 'path', 'projects/house-of-wellness/interior-unit-balcony-b5.webp', 'labelEs', 'Balcón', 'labelEn', 'Balcony'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/interior-unit-kitchen-b5.webp', 'path', 'projects/house-of-wellness/interior-unit-kitchen-b5.webp', 'labelEs', 'Cocina', 'labelEn', 'Kitchen'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/house-of-wellness/residences-bath.webp', 'path', 'projects/house-of-wellness/residences-bath.webp', 'labelEs', 'Baño', 'labelEn', 'Bathroom')
)
where title = 'HOUSE OF WELLNESS';

update public.projects
set gallery_images = jsonb_build_array(
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/exterior-se-angle.webp', 'path', 'projects/cassia/exterior-se-angle.webp', 'labelEs', 'Exterior', 'labelEn', 'Exterior'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/exterior-se-angle-night.webp', 'path', 'projects/cassia/exterior-se-angle-night.webp', 'labelEs', 'Nocturna', 'labelEn', 'Night view'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/paseo.webp', 'path', 'projects/cassia/paseo.webp', 'labelEs', 'Paseo', 'labelEn', 'Paseo'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/pooldeck-aerial.webp', 'path', 'projects/cassia/pooldeck-aerial.webp', 'labelEs', 'Rooftop pool', 'labelEn', 'Rooftop pool'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/living-room.webp', 'path', 'projects/cassia/living-room.webp', 'labelEs', 'Sala', 'labelEn', 'Living room'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/living-room-north-view.webp', 'path', 'projects/cassia/living-room-north-view.webp', 'labelEs', 'Vista interior', 'labelEn', 'Interior view'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/kitchen-area.webp', 'path', 'projects/cassia/kitchen-area.webp', 'labelEs', 'Cocina', 'labelEn', 'Kitchen'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/terrace.webp', 'path', 'projects/cassia/terrace.webp', 'labelEs', 'Terraza', 'labelEn', 'Terrace'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/bedroom.webp', 'path', 'projects/cassia/bedroom.webp', 'labelEs', 'Habitación', 'labelEn', 'Bedroom'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/bedroom-double-beds.webp', 'path', 'projects/cassia/bedroom-double-beds.webp', 'labelEs', 'Doble habitación', 'labelEn', 'Double bedroom'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/closet.webp', 'path', 'projects/cassia/closet.webp', 'labelEs', 'Clóset', 'labelEn', 'Closet'),
  jsonb_build_object('url', 'https://velgoadpmhssqptkcjam.supabase.co/storage/v1/object/public/project-images/projects/cassia/closet-primary-bedroom.webp', 'path', 'projects/cassia/closet-primary-bedroom.webp', 'labelEs', 'Clóset principal', 'labelEn', 'Primary closet')
)
where title = 'CASSIA CORAL GABLES';
