CREATE OR REPLACE VIEW "public"."upcoming_enrollments" AS 
   SELECT DISTINCT ON (profile.id, course.id, org.id, cc.status)
    profile.id AS profile_id,
    course.course_level,
    schedule.start AS schedule_start,
    course.id AS course_id,
    org.id AS org_id,
    org.name AS org_name,
    cc.status AS certification_status
   FROM ((((profile profile
     JOIN course_participant cp ON ((cp.profile_id = profile.id)))
     JOIN course course ON ((course.id = cp.course_id)))
     JOIN organization org ON ((course.organization_id = org.id)))
     JOIN course_schedule schedule ON ((schedule.course_id = course.id)))
     JOIN course_certificate cc ON ((cc.profile_id = profile.id))
  WHERE (schedule."end" > now()) AND cc.status IN ('ACTIVE','ON_HOLD','EXPIRED_RECENTLY','EXPIRING_SOON')
   AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)
   AND profile.archived IS FALSE;
  
CREATE OR REPLACE FUNCTION update_organizations_statistics(org_id uuid)
    RETURNS VOID
    LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM organizations_statistics WHERE organization_id = org_id;
    INSERT INTO organizations_statistics(organization_id, individuals, active_certifications, on_hold_certifications, expiring_soon_certifications, expired_recently_certifications)
        VALUES (org_id, (SELECT COUNT(*) FROM organization_member WHERE organization_id = org_id),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cc.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'ACTIVE' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cc.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'ON_HOLD' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cc.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'EXPIRING_SOON' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cc.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'EXPIRED_RECENTLY' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)));
END;
$function$;