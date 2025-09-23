
CREATE TABLE IF NOT EXISTS public.user_auth_audits (
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sub VARCHAR NOT NULL,
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY (id)
);


CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.user_auth_audit_type (
    name TEXT NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO public.user_auth_audit_type (name)
VALUES 
    ('FORGOT_PASSWORD_START'), 
    ('FORGOT_PASSWORD_SUCCESS'), 
    ('LOGIN'), 
    ('RESET_PASSWORD'), 
    ('SIGN_UP')
ON CONFLICT (name) DO NOTHING;


ALTER TABLE public.user_auth_audits
ADD COLUMN event_type TEXT NOT NULL;

ALTER TABLE public.user_auth_audits
ADD CONSTRAINT user_auth_audits_event_type_fkey
FOREIGN KEY (event_type)
REFERENCES public.user_auth_audit_type(name)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
