DROP VIEW IF EXISTS upcoming_enrollments;

CREATE VIEW upcoming_enrollments AS
SELECT profile.id          as profile_id,
       course.course_level as course_level,
       schedule.start      as schedule_start,
       course.id           as course_id,
       org.id              as org_id,
       org.name            as org_name
FROM public.profile profile
         JOIN public.course_participant cp ON cp.profile_id = profile.id
         JOIN public.course course ON course.id = cp.course_id
         JOIN public.organization org ON course.organization_id = org.id
         JOIN public.course_schedule schedule ON schedule.course_id = course.id
WHERE schedule.end > NOW();
