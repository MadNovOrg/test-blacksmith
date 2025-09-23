CREATE TABLE "public"."course_certificate_hold_request" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "certificate_id" uuid NOT NULL UNIQUE, 
    "changelog_id" uuid NOT NULL UNIQUE, 
    "expiry_date" date NOT NULL, 
    "start_date" date NOT NULL,
    FOREIGN KEY ("certificate_id") REFERENCES "public"."course_certificate"("id") ON UPDATE cascade ON DELETE cascade, 
    UNIQUE ("id"),
    PRIMARY KEY ("id")
);
    

CREATE OR REPLACE FUNCTION public.course_certificate_status(course_certificate_row course_certificate)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT
    CASE WHEN course_certificate_row.is_revoked THEN E'REVOKED'
         WHEN course_certificate_row.id IN (SELECT certificate_id FROM course_certificate_hold_request WHERE start_date < NOW()) THEN E'ON_HOLD'
         WHEN course_certificate_row.expiry_date < NOW() - interval '1' month THEN E'EXPIRED'
         WHEN (course_certificate_row.expiry_date >= NOW() - interval '1' month) AND (course_certificate_row.expiry_date < NOW()) THEN E'EXPIRED_RECENTLY'
         WHEN (course_certificate_row.expiry_date >= NOW()) AND (course_certificate_row.expiry_date < NOW() + interval '1' month) THEN E'EXPIRING_SOON'
         ELSE E'ACTIVE'
        END
$function$;