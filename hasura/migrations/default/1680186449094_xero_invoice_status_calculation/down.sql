CREATE OR REPLACE FUNCTION public.calculate_invoice_status(invoice_row xero_invoice)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT
    CASE WHEN ((invoice_row._status = ANY('{AUTHORISED, SUBMITTED}'::text[])) AND invoice_row.due_date::DATE <= NOW()::DATE) THEN E'OVERDUE'
         ELSE invoice_row._status
        END
$function$;
