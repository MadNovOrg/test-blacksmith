-- This first migration is never meant to be migrate down

SET check_function_bodies = false;
CREATE FUNCTION public.course_certificate_number_generation_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (NEW.course_id IS NOT NULL) THEN
        NEW.number = CONCAT(NEW.number, '-', (
            SELECT COUNT(*) + 1
            FROM course_certificate
            WHERE course_id = NEW.course_id
        ));
    END IF;
    RETURN NEW;
END
$$;
CREATE TABLE public.profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    given_name character varying NOT NULL,
    family_name character varying NOT NULL,
    title character varying,
    tags jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    contact_details jsonb DEFAULT '[]'::jsonb NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    addresses jsonb DEFAULT '[]'::jsonb NOT NULL,
    preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    original_record jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    go1_id integer,
    stripe_customer_id character varying,
    go1_profile jsonb DEFAULT '{}'::jsonb,
    email text,
    phone text,
    job_title text,
    dob date,
    dietary_restrictions text,
    disabilities text
);
CREATE FUNCTION public.profile_full_name(profile_row public.profile) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT profile_row.given_name || ' ' || profile_row.family_name
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE FUNCTION public.updated_at_field() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TABLE public.availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    description text,
    type text NOT NULL,
    profile_id uuid NOT NULL
);
CREATE TABLE public.availability_type (
    value text NOT NULL
);
CREATE TABLE public.blended_learning_status (
    name text NOT NULL
);
COMMENT ON TABLE public.blended_learning_status IS 'status enum for go1 course/module';
CREATE TABLE public.color (
    name text NOT NULL
);
CREATE SEQUENCE public.course_id_seq
    START WITH 10000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.course (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    course_type text NOT NULL,
    course_delivery_type text NOT NULL,
    course_level text,
    organization_id uuid,
    reaccreditation boolean DEFAULT false,
    description text,
    course_status text DEFAULT 'PENDING'::text,
    min_participants integer DEFAULT 6 NOT NULL,
    max_participants integer DEFAULT 12 NOT NULL,
    grading_confirmed boolean DEFAULT false NOT NULL,
    go1_integration boolean DEFAULT false NOT NULL,
    aol_cost_of_course numeric,
    id integer DEFAULT nextval('public.course_id_seq'::regclass) NOT NULL,
    contact_profile_id uuid
);
CREATE TABLE public.course_certificate (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    course_id integer,
    number text NOT NULL,
    expiry_date date NOT NULL,
    profile_id uuid NOT NULL,
    course_name text NOT NULL,
    course_level text NOT NULL,
    certification_date date NOT NULL
);
CREATE TABLE public.course_certificate_changelog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    participant_id uuid NOT NULL,
    old_grade text NOT NULL,
    new_grade text NOT NULL,
    notes text NOT NULL,
    author_id uuid NOT NULL
);
CREATE TABLE public.course_delivery_type (
    name text NOT NULL
);
CREATE TABLE public.course_evaluation_answers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question_id uuid NOT NULL,
    answer text,
    profile_id uuid NOT NULL,
    course_id integer NOT NULL
);
CREATE TABLE public.course_evaluation_question_group (
    name text NOT NULL
);
CREATE TABLE public.course_evaluation_question_type (
    name text NOT NULL
);
CREATE TABLE public.course_evaluation_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    type text DEFAULT 'TEXT'::text,
    "group" text,
    question_key text,
    required boolean DEFAULT true NOT NULL
);
COMMENT ON TABLE public.course_evaluation_questions IS 'Table for storing text and references of course evaluation questions';
CREATE TABLE public.course_invite_status (
    name text NOT NULL
);
COMMENT ON TABLE public.course_invite_status IS 'Enums for status of course registration invites';
CREATE TABLE public.course_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'PENDING'::text,
    email text,
    note text,
    course_id integer NOT NULL
);
COMMENT ON TABLE public.course_invites IS 'Represents course registration invitations';
CREATE TABLE public.course_level (
    name text NOT NULL
);
CREATE TABLE public.course_module (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    module_id uuid NOT NULL,
    covered boolean,
    course_id integer NOT NULL
);
CREATE TABLE public.course_participant (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registration_id uuid,
    invoice_id uuid,
    booking_date timestamp with time zone DEFAULT now(),
    profile_id uuid NOT NULL,
    invite_id uuid,
    go1_enrolment_id integer,
    attended boolean,
    go1_enrolment_status text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    grading_feedback text,
    grade text,
    date_graded timestamp with time zone,
    course_id integer NOT NULL,
    certificate_id uuid
);
CREATE TABLE public.course_participant_module (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_participant_id uuid NOT NULL,
    module_id uuid NOT NULL,
    completed boolean NOT NULL
);
COMMENT ON TABLE public.course_participant_module IS 'Course modules that course participant completed';
CREATE TABLE public.course_schedule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    venue_id uuid,
    virtual_link text,
    course_id integer NOT NULL
);
CREATE TABLE public.course_status (
    name text NOT NULL
);
CREATE TABLE public.course_trainer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    type text NOT NULL,
    course_id integer NOT NULL,
    status text DEFAULT 'PENDING'::text
);
CREATE TABLE public.course_trainer_type (
    name text NOT NULL
);
CREATE TABLE public.course_type (
    name text NOT NULL
);
CREATE TABLE public.grade (
    name text NOT NULL
);
COMMENT ON TABLE public.grade IS 'Enum table for possible course grades';
CREATE TABLE public.identity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id character varying NOT NULL,
    profile_id uuid NOT NULL,
    type text NOT NULL
);
CREATE TABLE public.identity_type (
    value text NOT NULL
);
CREATE TABLE public.legacy_certificate (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    original_record jsonb DEFAULT '{}'::jsonb NOT NULL,
    number text NOT NULL,
    course_name text NOT NULL,
    legacy_id integer NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    expiry_date date NOT NULL,
    certification_date date NOT NULL,
    course_certificate_id uuid
);
CREATE TABLE public.module (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text,
    module_category text NOT NULL,
    module_group_id uuid,
    course_level text NOT NULL
);
CREATE TABLE public.module_category (
    name text NOT NULL
);
CREATE TABLE public.module_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    mandatory boolean DEFAULT false NOT NULL,
    course_level text NOT NULL,
    color text NOT NULL
);
CREATE TABLE public.module_group_duration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    module_group_id uuid NOT NULL,
    course_delivery_type text NOT NULL,
    reaccreditation boolean DEFAULT false NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    go1_integration boolean DEFAULT false NOT NULL
);
CREATE TABLE public."order" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id integer NOT NULL,
    profile_id uuid NOT NULL,
    quantity integer NOT NULL,
    payment_method text NOT NULL,
    billing_address text NOT NULL,
    billing_given_name text NOT NULL,
    billing_family_name text NOT NULL,
    billing_email text NOT NULL,
    billing_phone text NOT NULL,
    registrants json NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    price double precision,
    vat double precision,
    order_total double precision,
    organization_id uuid NOT NULL,
    currency text,
    "stripePaymentId" text,
    promo_codes json DEFAULT '{}'::json
);
CREATE TABLE public.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    tags jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    contact_details jsonb DEFAULT '[]'::jsonb NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    addresses jsonb DEFAULT '[]'::jsonb NOT NULL,
    preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    original_record jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.organization_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    parent_organization_id uuid NOT NULL,
    _source character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.organization_member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    member_type character varying,
    _source character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.organization_member_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_member_id uuid NOT NULL,
    organization_role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    _source character varying
);
CREATE TABLE public.organization_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    role_id uuid NOT NULL,
    _source character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.organization_status (
    value text NOT NULL
);
CREATE TABLE public.payment_methods (
    name text NOT NULL
);
CREATE TABLE public.profile_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid NOT NULL,
    role_id uuid NOT NULL,
    _source character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.profile_status (
    value text NOT NULL
);
CREATE TABLE public.profile_temp (
    id integer NOT NULL,
    email text NOT NULL,
    given_name text NOT NULL,
    family_name text NOT NULL,
    phone text,
    dob date,
    accept_marketing boolean NOT NULL,
    accept_tcs boolean NOT NULL,
    sector text,
    job_title text,
    course_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    organization_id uuid,
    quantity integer
);
COMMENT ON TABLE public.profile_temp IS 'Contains partial temporary profiles until account in cognito is confirmed';
CREATE SEQUENCE public.profile_temp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.profile_temp_id_seq OWNED BY public.profile_temp.id;
CREATE TABLE public.resource (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    rank integer
);
CREATE TABLE public.venue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    geo_coordinates point,
    city text NOT NULL,
    address_line_one text NOT NULL,
    address_line_two text,
    post_code text NOT NULL,
    google_places_id text
);
ALTER TABLE ONLY public.profile_temp ALTER COLUMN id SET DEFAULT nextval('public.profile_temp_id_seq'::regclass);
ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.availability_type
    ADD CONSTRAINT availability_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.blended_learning_status
    ADD CONSTRAINT blended_learning_status_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_autoincremental_id_key UNIQUE (id);
ALTER TABLE ONLY public.course_certificate_changelog
    ADD CONSTRAINT course_certificate_changelog_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_certificate
    ADD CONSTRAINT course_certificate_number_key UNIQUE (number);
ALTER TABLE ONLY public.course_certificate
    ADD CONSTRAINT course_certificate_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_delivery_type
    ADD CONSTRAINT course_delivery_type_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_evaluation_answers
    ADD CONSTRAINT course_evaluation_answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_evaluation_question_group
    ADD CONSTRAINT course_evaluation_question_group_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_evaluation_question_type
    ADD CONSTRAINT course_evaluation_question_type_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_evaluation_questions
    ADD CONSTRAINT course_evaluation_questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_evaluation_questions
    ADD CONSTRAINT course_evaluation_questions_question_key_key UNIQUE (question_key);
ALTER TABLE ONLY public.course_invite_status
    ADD CONSTRAINT course_invite_status_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_invites
    ADD CONSTRAINT course_invites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_leader_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_level
    ADD CONSTRAINT course_level_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_module
    ADD CONSTRAINT course_module_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_participant_module
    ADD CONSTRAINT course_participant_module_course_participant_id_module_id_key UNIQUE (course_participant_id, module_id);
ALTER TABLE ONLY public.course_participant_module
    ADD CONSTRAINT course_participant_module_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.course_status
    ADD CONSTRAINT course_status_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_trainer_course_id_profile_id_key UNIQUE (course_id, profile_id);
ALTER TABLE ONLY public.course_trainer_type
    ADD CONSTRAINT course_trainer_type_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.course_type
    ADD CONSTRAINT course_type_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_provider_id_key UNIQUE (provider_id);
ALTER TABLE ONLY public.identity_type
    ADD CONSTRAINT identity_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.legacy_certificate
    ADD CONSTRAINT legacy_certificate_legacy_id_key UNIQUE (legacy_id);
ALTER TABLE ONLY public.legacy_certificate
    ADD CONSTRAINT legacy_certificate_number_key UNIQUE (number);
ALTER TABLE ONLY public.legacy_certificate
    ADD CONSTRAINT legacy_certificate_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.module_category
    ADD CONSTRAINT module_category_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.module_group_duration
    ADD CONSTRAINT module_group_duration_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.module_group
    ADD CONSTRAINT module_group_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_organization_id_parent_organization_id_key UNIQUE (organization_id, parent_organization_id);
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_profile_id_organization_id_key UNIQUE (profile_id, organization_id);
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_memeber_role_organization_member_id_organizati_key UNIQUE (organization_member_id, organization_role_id);
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_memeber_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_role_id_organization_id_key UNIQUE (role_id, organization_id);
ALTER TABLE ONLY public.organization_status
    ADD CONSTRAINT organization_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (name);
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_email_key UNIQUE (email);
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profile_role
    ADD CONSTRAINT profile_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profile_role
    ADD CONSTRAINT profile_role_profile_id_role_id_key UNIQUE (profile_id, role_id);
ALTER TABLE ONLY public.profile_status
    ADD CONSTRAINT profile_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_stripe_customer_id_key UNIQUE (stripe_customer_id);
ALTER TABLE ONLY public.profile_temp
    ADD CONSTRAINT profile_temp_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_key UNIQUE (name);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.venue
    ADD CONSTRAINT venue_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX course_trainer_unique_leader ON public.course_trainer USING btree (course_id) WHERE (type = 'LEADER'::text);
CREATE INDEX organization_member_profile_id_idx ON public.organization_member USING btree (profile_id);
CREATE INDEX profile_role_profile_id_idx ON public.profile_role USING btree (profile_id);
CREATE TRIGGER course_certificate_number_generation_trigger BEFORE INSERT ON public.course_certificate FOR EACH ROW EXECUTE FUNCTION public.course_certificate_number_generation_trigger();
CREATE TRIGGER set_public_availability_updated_at BEFORE UPDATE ON public.availability FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_availability_updated_at ON public.availability IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_certificate_changelog_updated_at BEFORE UPDATE ON public.course_certificate_changelog FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_certificate_changelog_updated_at ON public.course_certificate_changelog IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_certificate_updated_at BEFORE UPDATE ON public.course_certificate FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_certificate_updated_at ON public.course_certificate IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_invites_updated_at BEFORE UPDATE ON public.course_invites FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_invites_updated_at ON public.course_invites IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_module_updated_at BEFORE UPDATE ON public.course_module FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_module_updated_at ON public.course_module IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_schedule_updated_at BEFORE UPDATE ON public.course_schedule FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_schedule_updated_at ON public.course_schedule IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_course_updated_at BEFORE UPDATE ON public.course FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_course_updated_at ON public.course IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_legacy_certificate_updated_at BEFORE UPDATE ON public.legacy_certificate FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_legacy_certificate_updated_at ON public.legacy_certificate IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_module_group_duration_updated_at BEFORE UPDATE ON public.module_group_duration FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_module_group_duration_updated_at ON public.module_group_duration IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_module_group_updated_at BEFORE UPDATE ON public.module_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_module_group_updated_at ON public.module_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_module_updated_at BEFORE UPDATE ON public.module FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_module_updated_at ON public.module IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_resource_updated_at BEFORE UPDATE ON public.resource FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_resource_updated_at ON public.resource IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_venue_updated_at BEFORE UPDATE ON public.venue FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_venue_updated_at ON public.venue IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER trigger_organization_member_role_updated_at BEFORE UPDATE ON public.organization_member_role FOR EACH ROW EXECUTE FUNCTION public.updated_at_field();
CREATE TRIGGER trigger_organization_role_updated_at BEFORE UPDATE ON public.organization_role FOR EACH ROW EXECUTE FUNCTION public.updated_at_field();
CREATE TRIGGER trigger_organization_updated_at BEFORE UPDATE ON public.organization FOR EACH ROW EXECUTE FUNCTION public.updated_at_field();
CREATE TRIGGER trigger_profile_role_updated_at BEFORE UPDATE ON public.profile_role FOR EACH ROW EXECUTE FUNCTION public.updated_at_field();
CREATE TRIGGER trigger_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.updated_at_field();
ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_type_fkey FOREIGN KEY (type) REFERENCES public.availability_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_certificate_changelog
    ADD CONSTRAINT course_certificate_changelog_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profile(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_certificate_changelog
    ADD CONSTRAINT course_certificate_changelog_new_grade_fkey FOREIGN KEY (new_grade) REFERENCES public.grade(name) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.course_certificate_changelog
    ADD CONSTRAINT course_certificate_changelog_old_grade_fkey FOREIGN KEY (old_grade) REFERENCES public.grade(name) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.course_certificate_changelog
    ADD CONSTRAINT course_certificate_changelog_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.course_participant(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_certificate
    ADD CONSTRAINT course_certificate_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_contact_profile_id_fkey FOREIGN KEY (contact_profile_id) REFERENCES public.profile(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_course_delivery_type_fkey FOREIGN KEY (course_delivery_type) REFERENCES public.course_delivery_type(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_course_level_fkey FOREIGN KEY (course_level) REFERENCES public.course_level(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_course_status_fkey FOREIGN KEY (course_status) REFERENCES public.course_status(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_course_type_fkey FOREIGN KEY (course_type) REFERENCES public.course_type(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_evaluation_answers
    ADD CONSTRAINT course_evaluation_answers_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_evaluation_answers
    ADD CONSTRAINT course_evaluation_answers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_evaluation_answers
    ADD CONSTRAINT course_evaluation_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.course_evaluation_questions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_evaluation_questions
    ADD CONSTRAINT course_evaluation_questions_group_fkey FOREIGN KEY ("group") REFERENCES public.course_evaluation_question_group(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_evaluation_questions
    ADD CONSTRAINT course_evaluation_questions_type_fkey FOREIGN KEY (type) REFERENCES public.course_evaluation_question_type(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_invites
    ADD CONSTRAINT course_invites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_invites
    ADD CONSTRAINT course_invites_status_fkey FOREIGN KEY (status) REFERENCES public.course_invite_status(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_leader_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_leader_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_leader_type_fkey FOREIGN KEY (type) REFERENCES public.course_trainer_type(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_module
    ADD CONSTRAINT course_module_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_module
    ADD CONSTRAINT course_module_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_certificate_id_fkey FOREIGN KEY (certificate_id) REFERENCES public.course_certificate(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_go1_enrolment_status_fkey FOREIGN KEY (go1_enrolment_status) REFERENCES public.blended_learning_status(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_grade_fkey FOREIGN KEY (grade) REFERENCES public.grade(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_invite_id_fkey FOREIGN KEY (invite_id) REFERENCES public.course_invites(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant_module
    ADD CONSTRAINT course_participant_module_course_participant_id_fkey FOREIGN KEY (course_participant_id) REFERENCES public.course_participant(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant_module
    ADD CONSTRAINT course_participant_module_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_participant
    ADD CONSTRAINT course_participant_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.course_schedule
    ADD CONSTRAINT course_schedule_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venue(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.course_trainer
    ADD CONSTRAINT course_trainer_status_fkey FOREIGN KEY (status) REFERENCES public.course_invite_status(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.identity
    ADD CONSTRAINT identity_type_fkey FOREIGN KEY (type) REFERENCES public.identity_type(value);
ALTER TABLE ONLY public.legacy_certificate
    ADD CONSTRAINT legacy_certificate_course_certificate_id_fkey FOREIGN KEY (course_certificate_id) REFERENCES public.course_certificate(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_course_level_fkey FOREIGN KEY (course_level) REFERENCES public.course_level(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.module_group
    ADD CONSTRAINT module_group_color_fkey FOREIGN KEY (color) REFERENCES public.color(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.module_group
    ADD CONSTRAINT module_group_course_level_fkey FOREIGN KEY (course_level) REFERENCES public.course_level(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.module_group_duration
    ADD CONSTRAINT module_group_duration_course_delivery_type_fkey FOREIGN KEY (course_delivery_type) REFERENCES public.course_delivery_type(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.module_group_duration
    ADD CONSTRAINT module_group_duration_module_group_id_fkey FOREIGN KEY (module_group_id) REFERENCES public.module_group(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_module_category_fkey FOREIGN KEY (module_category) REFERENCES public.module_category(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_module_group_id_fkey FOREIGN KEY (module_group_id) REFERENCES public.module_group(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_payment_method_fkey FOREIGN KEY (payment_method) REFERENCES public.payment_methods(name) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_group
    ADD CONSTRAINT organization_group_parent_organization_id_fkey FOREIGN KEY (parent_organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_member_role_organization_member_id_fkey FOREIGN KEY (organization_member_id) REFERENCES public.organization_member(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_member_role
    ADD CONSTRAINT organization_member_role_organization_role_id_fkey FOREIGN KEY (organization_role_id) REFERENCES public.organization_role(id);
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.organization_role
    ADD CONSTRAINT organization_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);
ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_status_fkey FOREIGN KEY (status) REFERENCES public.organization_status(value);
ALTER TABLE ONLY public.profile_role
    ADD CONSTRAINT profile_role_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profile(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profile_role
    ADD CONSTRAINT profile_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_status_fkey FOREIGN KEY (status) REFERENCES public.profile_status(value);
ALTER TABLE ONLY public.profile_temp
    ADD CONSTRAINT profile_temp_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


INSERT INTO "blended_learning_status" ("name") VALUES
('ASSIGNED'),
('NOT_STARTED'),
('IN_PROGRESS'),
('COMPLETED');

INSERT INTO "color" ("name") VALUES
('navy'),
('lime'),
('teal'),
('yellow'),
('purple'),
('fuschia'),
('grey');

INSERT INTO "course_delivery_type" ("name") VALUES
('F2F'),
('VIRTUAL'),
('MIXED');

INSERT INTO "course_evaluation_question_group" ("name") VALUES
('TRAINING_RATING'),
('TRAINING_RELEVANCE'),
('TRAINER_STANDARDS'),
('MATERIALS_AND_VENUE'),
('UNGROUPED');

INSERT INTO "course_evaluation_question_type" ("name") VALUES
('RATING'),
('BOOLEAN'),
('TEXT'),
('BOOLEAN_REASON_Y'),
('BOOLEAN_REASON_N');

INSERT INTO "course_invite_status" ("name") VALUES
('PENDING'),
('ACCEPTED'),
('DECLINED');

INSERT INTO "course_level" ("name") VALUES
('LEVEL_1'),
('LEVEL_2'),
('ADVANCED'),
('BILD_ACT'),
('INTERMEDIATE_TRAINER'),
('ADVANCED_TRAINER'),
('BILD_ACT_TRAINER');

INSERT INTO "course_status" ("name") VALUES
('PENDING'),
('DRAFT'),
('SCHEDULED');

INSERT INTO "course_trainer_type" ("name") VALUES
('LEADER'),
('ASSISTANT'),
('MODERATOR');

INSERT INTO "course_type" ("name") VALUES
('OPEN'),
('CLOSED'),
('INDIRECT');

INSERT INTO "grade" ("name") VALUES
('PASS'),
('OBSERVE_ONLY'),
('FAIL'),
('ASSIST_ONLY');

INSERT INTO "identity_type" ("value") VALUES
('cognito');

INSERT INTO "module_category" ("name") VALUES
('PHYSICAL'),
('THEORY');

INSERT INTO "organization_status" ("value") VALUES
('active');

INSERT INTO "payment_methods" ("name") VALUES
('CC'),
('INVOICE');

INSERT INTO "profile_status" ("value") VALUES
('active');

INSERT INTO "public"."role"("id", "name", "rank") VALUES
(E'd51b5b93-3bfd-43e5-b9fb-86b23c8d4a79', E'unverified', 5),
(E'151f0884-a8c8-48e2-a619-c4434864ea67', E'user', 10),
(E'2ad2c32a-0cca-42cf-b456-fa68af0aa55f', E'trainer', 20),
(E'd29e7b0a-cd9d-43e7-b917-f66fd9f7b5e5', E'org-admin', 30),
(E'7a1efed5-5193-42bf-8144-45ad09936826', E'mta-admin', 40),
(E'984b6d9f-1ae5-41ff-8f85-85305bf8d684', E'tt-ops', 50),
(E'88398629-b805-4630-8b27-672b2ba8e973', E'tt-admin', 60),
(E'4018e4f4-db34-4a3e-9490-e5458efe288b', E'admin', 100);
