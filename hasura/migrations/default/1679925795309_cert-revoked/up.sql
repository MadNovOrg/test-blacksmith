

alter table "public"."course_certificate" add column "is_revoked" boolean
 not null default 'false';

CREATE OR REPLACE FUNCTION public.course_certificate_status(course_certificate_row course_certificate)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT
    CASE WHEN course_certificate_row.is_revoked THEN E'REVOKED'
         WHEN course_certificate_row.expiry_date < NOW() - interval '1' month THEN E'EXPIRED'
         WHEN (course_certificate_row.expiry_date >= NOW() - interval '1' month) AND (course_certificate_row.expiry_date < NOW()) THEN E'EXPIRED_RECENTLY'
         WHEN (course_certificate_row.expiry_date >= NOW()) AND (course_certificate_row.expiry_date < NOW() + interval '1' month) THEN E'EXPIRING_SOON'
         ELSE E'ACTIVE'
        END
$function$;

INSERT INTO "public"."certificate_status"("name") VALUES (E'REVOKED');
