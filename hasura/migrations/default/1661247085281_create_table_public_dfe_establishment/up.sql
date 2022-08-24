CREATE TABLE "public"."dfe_establishment"
(
    "id"                     uuid NOT NULL DEFAULT gen_random_uuid(),
    "urn"                    text NOT NULL,
    "name"                   text NOT NULL,
    "local_authority"        text NOT NULL,
    "trust_type"             text NULL,
    "trust_name"             text NULL,
    "address_line_1"         text NULL,
    "address_line_2"         text NULL,
    "address_line_3"         text NULL,
    "town"                   text NULL,
    "county"                 text NULL,
    "postcode"               text NULL,
    "head_title"             text NULL,
    "head_first_name"        text NULL,
    "head_last_name"         text NULL,
    "head_job_title"         text NULL,
    "ofsted_rating"          text NULL,
    "ofsted_last_inspection" text NULL,
    PRIMARY KEY ("id")
);

