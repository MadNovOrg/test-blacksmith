alter table "public"."course_participant_audit" add column "participant_id" uuid;
alter table "public"."course_participant_audit" alter column "participant_id" drop not null;
alter table "public"."course_participant_audit"
    add constraint "course_participant_audit_participant_id_fkey"
        foreign key (participant_id)
            references "public"."course_participant"
                (id) on update no action on delete no action;

alter table "public"."course_participant_audit" drop column "course_id";
alter table "public"."course_participant_audit" drop column "profile_id";
