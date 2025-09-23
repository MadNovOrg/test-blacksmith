CREATE OR REPLACE FUNCTION public.participant_audit_participation_order_invoice_number(audit_row course_participant_audit)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT xero_invoice_number
FROM public.order
WHERE public.order.course_id = audit_row.course_id AND public.order.profile_id = audit_row.profile_id
LIMIT 1
$function$;
