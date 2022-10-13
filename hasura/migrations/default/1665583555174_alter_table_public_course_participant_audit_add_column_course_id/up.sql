alter table "public"."course_participant_audit"
    add column "course_id" integer
        not null;

alter table "public"."course_participant_audit"
    add column "profile_id" uuid
        not null;

alter table "public"."course_participant_audit"
    drop column "participant_id" cascade;

alter table "public"."course_participant_audit"
    add constraint "course_participant_audit_profile_id_fkey"
        foreign key ("profile_id")
            references "public"."profile"
                ("id") on update no action on delete no action;

alter table "public"."course_participant_audit"
    add constraint "course_participant_audit_course_id_fkey"
        foreign key ("course_id")
            references "public"."course"
                ("id") on update no action on delete no action;
