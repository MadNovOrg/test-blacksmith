
alter table "public"."course_pricing_changelog" drop constraint "course_pricing_changelog_author_id_fkey",
  add constraint "course_pricing_changelog_author_id_fkey"
  foreign key ("author_id")
  references "public"."profile"
  ("id") on update no action on delete no action;

alter table "public"."course_pricing_changelog" alter column "author_id" set not null;
