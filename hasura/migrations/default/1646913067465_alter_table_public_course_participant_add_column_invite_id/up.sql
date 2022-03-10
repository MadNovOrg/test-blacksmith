alter table "public"."course_participant" add column "invite_id" uuid
 null;

alter table "public"."course_participant"
    add constraint "course_participant_invite_id_fkey"
        foreign key ("invite_id")
            references "public"."course_invites"
                ("id") on update restrict on delete restrict;
