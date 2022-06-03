CREATE TABLE public.organization_status
(
    value text NOT NULL
);
ALTER TABLE ONLY public.organization_status
    ADD CONSTRAINT organization_status_pkey PRIMARY KEY (value);

CREATE TABLE public.profile_status
(
    value text NOT NULL
);
ALTER TABLE ONLY public.profile_status
    ADD CONSTRAINT profile_status_pkey PRIMARY KEY (value);

CREATE TABLE public.organization_group
(
    id                     uuid                     DEFAULT gen_random_uuid() NOT NULL,
    organization_id        uuid                                               NOT NULL,
    parent_organization_id uuid                                               NOT NULL,
    _source                character varying,
    created_at             timestamp with time zone DEFAULT now()             NOT NULL,
    updated_at             timestamp with time zone DEFAULT now()             NOT NULL
);
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_organization_id_parent_organization_id_key UNIQUE (organization_id, parent_organization_id);
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization (id) ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_parent_organization_id_fkey FOREIGN KEY (parent_organization_id) REFERENCES public.organization (id) ON DELETE CASCADE;

CREATE TABLE public.organization_role
(
    id              uuid                     DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid                                               NOT NULL,
    role_id         uuid                                               NOT NULL,
    _source         character varying,
    created_at      timestamp with time zone DEFAULT now()             NOT NULL,
    updated_at      timestamp with time zone DEFAULT now()             NOT NULL
);
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_role_id_organization_id_key UNIQUE (role_id, organization_id);
CREATE TRIGGER trigger_organization_role_updated_at
    BEFORE UPDATE
    ON public.organization_role
    FOR EACH ROW
EXECUTE FUNCTION public.updated_at_field();
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role (id);

CREATE TABLE public.organization_member_role
(
    id                     uuid                     DEFAULT gen_random_uuid() NOT NULL,
    organization_member_id uuid                                               NOT NULL,
    organization_role_id   uuid                                               NOT NULL,
    created_at             timestamp with time zone DEFAULT now()             NOT NULL,
    updated_at             timestamp with time zone DEFAULT now(),
    _source                character varying
);
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_memeber_role_organization_member_id_organizati_key UNIQUE (organization_member_id, organization_role_id);
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_memeber_role_pkey PRIMARY KEY (id);
CREATE TRIGGER trigger_organization_member_role_updated_at
    BEFORE UPDATE
    ON public.organization_member_role
    FOR EACH ROW
EXECUTE FUNCTION public.updated_at_field();
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_member_role_organization_member_id_fkey FOREIGN KEY (organization_member_id) REFERENCES public.organization_member (id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_member_role_organization_role_id_fkey FOREIGN KEY (organization_role_id) REFERENCES public.organization_role (id);

CREATE TABLE public.resource
(
    id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now()             NOT NULL,
    updated_at timestamp with time zone DEFAULT now()             NOT NULL
);
CREATE TRIGGER set_public_resource_updated_at
    BEFORE UPDATE
    ON public.resource
    FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_resource_updated_at ON public.resource IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."organization"
    ADD COLUMN "status" text;
ALTER TABLE "public"."organization"
    ALTER COLUMN "status" SET DEFAULT 'active';
ALTER TABLE "public"."organization"
    ALTER COLUMN "status" DROP NOT NULL;

ALTER TABLE "public"."profile"
    ADD COLUMN "status" text;
ALTER TABLE "public"."profile"
    ALTER COLUMN "status" SET DEFAULT 'active';
ALTER TABLE "public"."profile"
    ALTER COLUMN "status" DROP NOT NULL;

ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_status_fkey FOREIGN KEY (status) REFERENCES public.profile_status (value);
ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_status_fkey FOREIGN KEY (status) REFERENCES public.organization_status (value);

INSERT INTO "profile_status" ("value")
VALUES ('active');
INSERT INTO "organization_status" ("value")
VALUES ('active');
