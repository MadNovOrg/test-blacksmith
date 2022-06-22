alter table "public"."organization" add column "trust_type" text
 null;

alter table "public"."organization" add column "trust_name" text
    null;

alter table "public"."organization" drop column "last_activity" cascade;

CREATE TABLE "public"."trust_type"
(
    "name" text NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);

INSERT INTO "public"."trust_type"("name")
VALUES (E'SINGLE_ACADEMY_TRUST'),
       (E'MULTI_ACADEMY_TRUST'),
       (E'SUPPORTED_BY_A_TRUST'),
       (E'NOT_APPLICABLE');

alter table "public"."organization"
    add constraint "organization_trust_type_fkey"
        foreign key ("trust_type")
            references "public"."trust_type"
                ("name") on update cascade on delete cascade;

alter table "public"."profile" add column "last_activity" timestamptz
    not null default now();
