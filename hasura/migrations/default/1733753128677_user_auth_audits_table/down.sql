
ALTER TABLE public.user_auth_audits
DROP CONSTRAINT IF EXISTS user_auth_audits_event_type_fkey;

ALTER TABLE public.user_auth_audits
DROP COLUMN IF EXISTS event_type;

DELETE FROM public.user_auth_audit_type
WHERE name = 'LOGIN';

DROP TABLE IF EXISTS public.user_auth_audit_type;

DROP TABLE IF EXISTS public.user_auth_audits;
