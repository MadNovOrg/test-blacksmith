CREATE OR REPLACE FUNCTION public.merge_course_audit_rows(course_audit_row course_audit)
RETURNS text
LANGUAGE plpgsql
STABLE
AS $function$
BEGIN
    RETURN (
        SELECT
            COALESCE((
                SELECT string_agg(t._given_name || ' ' || t._family_name, ' ')
                FROM course_trainer AS ct 
                JOIN profile AS t ON ct.profile_id = t.id
                WHERE ct.course_id = c.id
            ) || ' ', '') || -- COURSE TRAINER FULL NAME
            
            COALESCE(c.course_code || ' ', '') || -- COURSE CODE
            COALESCE(org.name || ' ', '') || -- ORGANIZATION NAME
            
            COALESCE((
                SELECT string_agg(ab._given_name || ' ' || ab._family_name, ' ')
                FROM profile AS ab
                WHERE ca.authorized_by = ab.id
            ) || ' ', '') || -- AUTHORIZED BY FULL NAME
            
            COALESCE((
                SELECT string_agg(o.xero_invoice_number, '')
                FROM course_order AS co
                LEFT JOIN "order" AS o ON co.order_id = o.id
                WHERE co.course_id = ca.course_id
            ) || ' ', '') -- XERO INVOICE NUMBER
            
        FROM course_audit AS ca
        LEFT JOIN course AS c ON ca.course_id = c.id
        LEFT JOIN organization AS org ON c.organization_id = org.id
        WHERE ca.id = course_audit_row.id
    );
END;
$function$;
