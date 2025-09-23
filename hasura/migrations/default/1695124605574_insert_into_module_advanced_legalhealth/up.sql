DO $do$
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM public.module 
        WHERE name = 'Legal & Health' 
          AND module_group_id = (SELECT id FROM public.module_group WHERE name = 'Legal & Health' AND course_level = 'ADVANCED')
    ) THEN 
        INSERT INTO public.module (name, module_category, module_group_id, course_level)
        VALUES (
            'Legal & Health', 
            'THEORY', 
            (SELECT id FROM public.module_group WHERE name = 'Legal & Health' AND course_level = 'ADVANCED'), 
            'ADVANCED'
        );
    END IF; 
END $do$;
