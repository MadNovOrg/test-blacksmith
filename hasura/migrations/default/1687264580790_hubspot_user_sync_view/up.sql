CREATE VIEW hubspot_user_sync AS
WITH user_certs AS (
SELECT *, (
  CASE
   WHEN is_revoked THEN E'REVOKED'
   WHEN id IN
    (SELECT certificate_id FROM course_certificate_hold_request WHERE start_date < NOW()) THEN E'ON_HOLD'
    WHEN expiry_date < NOW() - interval '3' month THEN E'EXPIRED'
   WHEN (expiry_date >= NOW() - interval '3' month) AND
        (expiry_date < NOW()) THEN E'EXPIRED_RECENTLY'
   WHEN (expiry_date >= NOW()) AND
        (expiry_date < NOW() + interval '3' month) THEN E'EXPIRING_SOON'
   ELSE E'ACTIVE'
  END
  ) AS status FROM course_certificate
),
user_info AS (
SELECT
  profile.id AS profile_id,
  _family_name AS family_name,
  _given_name AS given_name,
  _email AS email,
  _phone AS phone,
  dob,
  job_title,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('name', role.name)) FILTER (WHERE role.id IS NOT NULL), '[]') AS roles,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('name', org.name, 'is_admin', org_member.is_admin)) FILTER (WHERE org_member.id IS NOT NULL), '[]') AS orgs,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('name', attendee_courses.name, 'status', attendee_courses.course_status)) FILTER (WHERE attendee_courses.id IS NOT NULL), '[]') AS courses_as_attendee,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('name', trainer_courses.name, 'status', trainer_courses.course_status, 'type', course_trainer.type)) FILTER (WHERE course_trainer.id IS NOT NULL), '[]') AS courses_as_trainer,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('course_name', user_certs.course_name, 'number', user_certs.number,'status', user_certs.status)) FILTER (WHERE user_certs.id IS NOT NULL), '[]') AS user_certs
FROM
  PUBLIC.profile
  LEFT JOIN PUBLIC.profile_role
    ON profile.id = profile_role.profile_id
  LEFT JOIN role
    ON profile_role.role_id = role.id
  LEFT JOIN PUBLIC.organization_member org_member
    ON profile.id = org_member.profile_id
  LEFT JOIN PUBLIC.organization org
    ON org_member.organization_id = org.id
  LEFT JOIN course_participant
    ON profile.id = course_participant.profile_id
  LEFT JOIN course attendee_courses
    ON course_participant.course_id = attendee_courses.id
  LEFT JOIN course_trainer
    ON profile.id = course_trainer.profile_id
  LEFT JOIN course trainer_courses
    ON course_trainer.course_id = trainer_courses.id
  LEFT JOIN user_certs
    ON profile.id = user_certs.profile_id
GROUP BY profile.id
)
SELECT
ui.profile_id,
ui.family_name,
ui.given_name,
ui.email,
ui.phone,
ui.dob,
ui.job_title,
array_to_string(
    ARRAY(
      SELECT
        'Name: ' || (elem->>'name')
      FROM jsonb_array_elements(ui.roles) AS elem
    ),
    E'\n'
  ) AS roles,
array_to_string(
    ARRAY(
      SELECT
        'Name: ' || (elem->>'name') || ', Is Admin: ' || (elem->>'is_admin')
      FROM jsonb_array_elements(ui.orgs) AS elem
    ),
    E'\n'
  ) AS orgs,
array_to_string(
    ARRAY(
      SELECT
        'Name: ' || (elem->>'name') || ', Status: ' || (elem->>'status')
      FROM jsonb_array_elements(ui.courses_as_attendee) AS elem
    ),
    E'\n'
  ) AS courses_as_attendee,
array_to_string(
    ARRAY(
      SELECT
        'Name: ' || (elem->>'name') || ', Status: ' || (elem->>'status') || ', Type: ' || (elem->>'type')
      FROM jsonb_array_elements(ui.courses_as_trainer) AS elem
    ),
    E'\n'
  ) AS courses_as_trainer,
array_to_string(
    ARRAY(
      SELECT
        'Course Name: ' || (elem->>'course_name') || ', Certificate ID: ' || (elem->>'number') || ', Status: ' || (elem->>'status')
      FROM jsonb_array_elements(ui.user_certs) AS elem
    ),
    E'\n'
  ) AS certificates
FROM user_info ui;
