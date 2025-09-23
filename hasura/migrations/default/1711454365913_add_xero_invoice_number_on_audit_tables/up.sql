ALTER TABLE course_participant_audit
ADD COLUMN xero_invoice_number text;

ALTER TABLE course_audit
ADD COLUMN xero_invoice_number text;

CREATE OR REPLACE FUNCTION public.merge_course_audit_rows(course_audit_row course_audit)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN (
        SELECT
            COALESCE((SELECT string_agg(t._given_name || ' ' || t._family_name, ' ')
                FROM course_trainer AS ct 
                JOIN profile as t ON ct.profile_id = t.id WHERE ct.course_id = c.id
                ) || ' ','') || -- COURSE TRAINER FULL NAME
            COALESCE(c.course_code || ' ', '') || -- COURSE CODE
            COALESCE(org.name || ' ', '') || -- ORGANIZATION NAME
            COALESCE((SELECT string_agg(ab._given_name || ' ' || ab._family_name, ' ')
                FROM profile AS ab WHERE ca.authorized_by = ab.id
                ) || ' ','') || -- AUTHORIZED BY FULL NAME
            CASE 
                WHEN ca.xero_invoice_number IS NOT NULL 
                    THEN COALESCE(ca.xero_invoice_number || ' ', '')
                ELSE COALESCE((SELECT o."xero_invoice_number" FROM course_order as co 
                    LEFT JOIN "order" AS o ON co.order_id = o.id 
                    WHERE co.course_id = ca.course_id LIMIT 1
                ) || ' ', '') -- XERO INVOICE NUMBER
            END
        FROM course_audit AS ca
        LEFT JOIN course as c ON ca.course_id = c.id
        LEFT JOIN organization as org on c.organization_id = org.id
        WHERE ca.id = course_audit_row.id
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.merge_course_participant_audit_rows(course_participant_audit_row course_participant_audit)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN (
        SELECT
            COALESCE((SELECT string_agg(p._given_name || ' ' || p._family_name, ' ')
                FROM profile AS p WHERE cpa.profile_id = p.id
                ) || ' ','') || -- PROFILE FULL NAME
            COALESCE((SELECT _email FROM profile AS p WHERE cpa.profile_id = p.id
                ) || ' ','') || -- PROFILE EMAIL
            COALESCE(c.course_code || ' ', '') || -- COURSE CODE
            COALESCE((SELECT string_agg(ab._given_name || ' ' || ab._family_name, ' ')
                FROM profile AS ab WHERE cpa.authorized_by = ab.id
                ) || ' ','') || -- AUTHORIZED BY FULL NAME
            COALESCE(cpa.payload->>'inviteeEmail' || ' ','') || -- NEW ATTENDEE EMAIL
            COALESCE((SELECT c.course_code FROM course AS c WHERE cpa.payload->'toCourse'->>'id' = c.id::text) || ' ','') || -- COURSE TO TRANSFER TO
            CASE
                WHEN cpa.xero_invoice_number IS NOT NULL 
                    THEN COALESCE(cpa.xero_invoice_number || ' ', '')
                ELSE COALESCE((SELECT o."xero_invoice_number" FROM course_order as co 
                    LEFT JOIN "order" AS o ON co.order_id = o.id 
                    WHERE co.course_id = cpa.course_id LIMIT 1
                ) || ' ', '') -- XERO INVOICE NUMBER
            END
        FROM course_participant_audit AS cpa
        LEFT JOIN course as c ON cpa.course_id = c.id
        WHERE cpa.id = course_participant_audit_row.id
    );
END;
$function$;

CREATE INDEX IF NOT EXISTS idx_organization_name ON organization(name);
CREATE INDEX IF NOT EXISTS idx_order_xero_invoice_number ON "order"(xero_invoice_number);

CREATE INDEX IF NOT EXISTS idx_course_audit_xero_invoice_number ON course_audit(xero_invoice_number);
CREATE INDEX IF NOT EXISTS idx_course_audit_authorized_by ON course_audit(authorized_by);
CREATE INDEX IF NOT EXISTS idx_course_audit_course_id ON course_audit(course_id);


CREATE INDEX IF NOT EXISTS idx_course_participant_audit_payload ON course_participant_audit(payload);
CREATE INDEX IF NOT EXISTS idx_course_participant_audit_authorized_by ON course_participant_audit(authorized_by);
CREATE INDEX IF NOT EXISTS idx_course_participant_audit_course_id ON course_participant_audit(course_id);
CREATE INDEX IF NOT EXISTS idx_course_participant_audit_profile_id ON course_participant_audit(profile_id);
CREATE INDEX IF NOT EXISTS idx_course_participant_audit_xero_invoice_number ON course_participant_audit(xero_invoice_number);


CREATE INDEX IF NOT EXISTS idx_course_name ON course(name);
CREATE INDEX IF NOT EXISTS idx_course_arlo_reference_id ON course("arloReferenceId");
CREATE INDEX IF NOT EXISTS idx_venue_name ON venue(name);
CREATE INDEX IF NOT EXISTS idx_venue_city ON venue(city);
CREATE INDEX IF NOT EXISTS idx_venue_address_line_one ON venue(address_line_one);
CREATE INDEX IF NOT EXISTS idx_venue_address_line_two ON venue(address_line_two);
CREATE INDEX IF NOT EXISTS idx_venue_country ON venue(country);
CREATE INDEX IF NOT EXISTS idx_venue_post_code ON venue(post_code);
