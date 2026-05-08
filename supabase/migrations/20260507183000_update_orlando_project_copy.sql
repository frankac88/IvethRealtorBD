alter table public.projects
  add column if not exists detail_question_es text,
  add column if not exists detail_question_en text;

update public.projects
set
  badge_es = title,
  badge_en = title,
  location_es = case upper(title)
    when 'CHAMPIONS GATE' then 'Davenport, Florida'
    when 'REUNION VILLAGE' then 'Kissimmee'
    when 'LAKE WILSON RESERVE' then 'Kissimmee, FL'
    when 'WELLNESS RIDGE' then 'Clermont, Florida'
    else location_es
  end,
  location_en = case upper(title)
    when 'CHAMPIONS GATE' then 'Davenport, Florida'
    when 'REUNION VILLAGE' then 'Kissimmee'
    when 'LAKE WILSON RESERVE' then 'Kissimmee, FL'
    when 'WELLNESS RIDGE' then 'Clermont, Florida'
    else location_en
  end,
  filter_location_es = case upper(title)
    when 'CHAMPIONS GATE' then 'Davenport, Florida'
    when 'REUNION VILLAGE' then 'Kissimmee'
    when 'LAKE WILSON RESERVE' then 'Kissimmee, FL'
    when 'WELLNESS RIDGE' then 'Clermont, Florida'
    else filter_location_es
  end,
  filter_location_en = case upper(title)
    when 'CHAMPIONS GATE' then 'Davenport, Florida'
    when 'REUNION VILLAGE' then 'Kissimmee'
    when 'LAKE WILSON RESERVE' then 'Kissimmee, FL'
    when 'WELLNESS RIDGE' then 'Clermont, Florida'
    else filter_location_en
  end,
  detail_question_es = case upper(title)
    when 'CHAMPIONS GATE' then 'Donde Disney es tu vecino y tu dinero trabaja solo.'
    when 'REUNION VILLAGE' then 'Donde el turismo no descansa — y tu inversión tampoco.'
    when 'STOREY LAKE' then 'Ideal para inversionistas enfocados en renta corta con alta ocupación en el mercado turístico de Orlando.'
    when 'STOREY LAKE RESORT' then 'Ideal para inversionistas enfocados en renta corta con alta ocupación en el mercado turístico de Orlando.'
    when 'STORY LAKE' then 'Ideal para inversionistas enfocados en renta corta con alta ocupación en el mercado turístico de Orlando.'
    when 'LAKE WILSON RESERVE' then 'Vive o invierte donde el mundo entero quiere estar.'
    when 'WELLNESS RIDGE' then 'Donde la vida activa y la naturaleza son tu vecindario.'
    else detail_question_es
  end,
  detail_question_en = case upper(title)
    when 'CHAMPIONS GATE' then 'Where Disney is your neighbor and your money works on its own.'
    when 'REUNION VILLAGE' then 'Where tourism never rests — and neither does your investment.'
    when 'STOREY LAKE' then 'Ideal for investors focused on short-term rentals with high occupancy in Orlando''s tourism market.'
    when 'STOREY LAKE RESORT' then 'Ideal for investors focused on short-term rentals with high occupancy in Orlando''s tourism market.'
    when 'STORY LAKE' then 'Ideal for investors focused on short-term rentals with high occupancy in Orlando''s tourism market.'
    when 'LAKE WILSON RESERVE' then 'Live or invest where the whole world wants to be.'
    when 'WELLNESS RIDGE' then 'Where active living and nature are your neighborhood.'
    else detail_question_en
  end,
  updated_at = now()
where upper(title) in (
  'CHAMPIONS GATE',
  'REUNION VILLAGE',
  'STOREY LAKE',
  'STOREY LAKE RESORT',
  'STORY LAKE',
  'LAKE WILSON RESERVE',
  'WELLNESS RIDGE'
);
