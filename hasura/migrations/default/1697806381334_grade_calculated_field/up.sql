CREATE FUNCTION public.course_certificate_grade(course_certificate_row public.course_certificate) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT p.grade FROM course_participant p WHERE p.certificate_id = course_certificate_row.id
$$;
