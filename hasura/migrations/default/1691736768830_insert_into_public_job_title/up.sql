DELETE FROM "public"."job_title" WHERE title LIKE '%,';

INSERT INTO "public"."job_title"("title") VALUES
(E'LSA (Learning Support Assistant)'),
(E'NQT (Newly Qualified Teacher)'),
(E'RI (Responsible Individual)'),
(E'Specialist Co-ordinator (Adults)'),
(E'TA (Teaching Assistant)')