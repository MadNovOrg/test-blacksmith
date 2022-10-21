CREATE OR REPLACE FUNCTION course_participant_audit_from_course(log_record course_participant_audit)
    RETURNS SETOF public.course
    LANGUAGE sql STABLE
AS $$
SELECT * FROM public.course c WHERE log_record.payload->'fromCourse'->>'id' = c.id::text
$$;

CREATE OR REPLACE FUNCTION course_participant_audit_to_course(log_record course_participant_audit)
    RETURNS SETOF public.course
    LANGUAGE sql STABLE
AS $$
SELECT * FROM public.course c WHERE log_record.payload->'toCourse'->>'id' = c.id::text
$$;

CREATE FUNCTION course_participant_audit_new_attendee(log_record course_participant_audit)
    RETURNS TEXT AS $$
SELECT log_record.payload->>'inviteeEmail'
$$ LANGUAGE sql STABLE;
