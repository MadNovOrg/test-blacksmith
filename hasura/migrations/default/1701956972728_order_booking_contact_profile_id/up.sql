CREATE OR REPLACE FUNCTION public.order_booking_contact_profile_id(order_row public.order)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
SELECT id
FROM profile
WHERE profile._email = order_row.booking_contact->>'email'
LIMIT 1
$function$;
