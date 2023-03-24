CREATE FUNCTION public.course_free_slots(course_row public.course) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT course_row.max_participants - count(cp.id)
FROM public.course_participant cp
WHERE cp.course_id = course_row.id
GROUP BY cp.course_id
$$;
