alter table "public"."legacy_certificate" add column "course_certificate_id" uuid
 null;

alter table "public"."legacy_certificate"
    add constraint "legacy_certificate_course_certificate_id_fkey"
        foreign key ("course_certificate_id")
            references "public"."course_certificate"
                ("id") on update no action on delete set null;
