DELETE FROM public.module
WHERE name = 'Legal & Health' AND module_group_id = (SELECT id FROM public.module_group WHERE name = 'Legal & Health' AND course_level = 'ADVANCED');
