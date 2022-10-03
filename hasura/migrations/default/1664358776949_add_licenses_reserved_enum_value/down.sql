DELETE FROM public.go1_licenses_history
WHERE event = 'LICENSES_RESERVED';

DELETE FROM public.go1_history_events 
WHERE name in (
    'LICENSES_RESERVED'
);
