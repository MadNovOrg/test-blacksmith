CREATE FUNCTION public.course_start_date(course_row public.course) RETURNS timestamp with time zone
    LANGUAGE sql STABLE
    AS $$
  SELECT MIN(schedule.start) FROM public.course_schedule schedule WHERE course_id = course_row.id
$$;

CREATE FUNCTION public.course_end_date(course_row public.course) RETURNS timestamp with time zone
    LANGUAGE sql STABLE
    AS $$
  SELECT MAX(schedule.end) FROM public.course_schedule schedule WHERE course_id = course_row.id
$$;
