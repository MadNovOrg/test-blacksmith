DROP VIEW IF EXISTS upcoming_enrollments;
CREATE OR REPLACE VIEW "public"."upcoming_enrollments" AS 
 SELECT profile.id AS profile_id,
    course.course_level,
    schedule.start AS schedule_start,
    course.id AS course_id,
    org.id AS org_id,
    org.name AS org_name
   FROM ((((profile profile
     JOIN course_participant cp ON ((cp.profile_id = profile.id)))
     JOIN course course ON ((course.id = cp.course_id)))
     JOIN organization org ON ((course.organization_id = org.id)))
     JOIN course_schedule schedule ON ((schedule.course_id = course.id)))
  WHERE (schedule."end" > now());
