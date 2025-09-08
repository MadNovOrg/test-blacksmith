INSERT INTO public.country_region (name, country)
SELECT 'Torbay',
       'England'
WHERE NOT EXISTS (
  SELECT 1 FROM public.country_region WHERE name = 'Torbay'
);