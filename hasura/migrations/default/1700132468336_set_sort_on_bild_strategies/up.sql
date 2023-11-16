alter table "public"."bild_strategy" add column "sort" integer null;

update bild_strategy
set sort = 1
where name = 'PRIMARY';

update bild_strategy
set sort = 2
where name = 'SECONDARY';

update bild_strategy
set sort = 3
where name = 'NON_RESTRICTIVE_TERTIARY';

update bild_strategy
set sort = 4
where name = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';

update bild_strategy
set sort = 5
where name = 'RESTRICTIVE_TERTIARY_ADVANCED';
