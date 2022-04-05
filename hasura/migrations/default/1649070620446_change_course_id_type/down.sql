ALTER TABLE course ADD COLUMN uuid_id uuid NOT NULL DEFAULT gen_random_uuid ();

ALTER TABLE course_evaluation_answers ADD COLUMN "course_id_new" uuid NULL;
ALTER TABLE course_invites ADD COLUMN "course_id_new" uuid NULL;
ALTER TABLE course_leader ADD COLUMN "course_id_new" uuid NULL;
ALTER TABLE course_module ADD COLUMN "course_id_new" uuid NULL;
ALTER TABLE course_participant ADD COLUMN "course_id_new" uuid NULL;
ALTER TABLE course_schedule ADD COLUMN "course_id_new" uuid NULL;

UPDATE course_evaluation_answers SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;
UPDATE course_invites SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;
UPDATE course_leader SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;
UPDATE course_module SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;
UPDATE course_participant SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;
UPDATE course_schedule SET course_id_new = c.uuid_id FROM course c WHERE c.id = course_id;

ALTER TABLE course_evaluation_answers DROP CONSTRAINT course_evaluation_answers_course_id_fkey;
ALTER TABLE course_invites DROP CONSTRAINT course_invites_course_id_fkey;
ALTER TABLE course_leader DROP CONSTRAINT course_leader_course_id_fkey;
ALTER TABLE course_module DROP CONSTRAINT course_module_course_id_fkey;
ALTER TABLE course_participant DROP CONSTRAINT course_participant_course_id_fkey;
ALTER TABLE course_schedule DROP CONSTRAINT course_schedule_course_id_fkey;

ALTER TABLE course_evaluation_answers DROP COLUMN course_id;
ALTER TABLE course_invites DROP COLUMN course_id;
ALTER TABLE course_leader DROP COLUMN course_id;
ALTER TABLE course_module DROP COLUMN course_id;
ALTER TABLE course_participant DROP COLUMN course_id;
ALTER TABLE course_schedule DROP COLUMN course_id;

ALTER TABLE course_evaluation_answers RENAME COLUMN course_id_new TO course_id;
ALTER TABLE course_invites RENAME COLUMN course_id_new TO course_id;
ALTER TABLE course_leader RENAME COLUMN course_id_new TO course_id;
ALTER TABLE course_module RENAME COLUMN course_id_new TO course_id;
ALTER TABLE course_participant RENAME COLUMN course_id_new TO course_id;
ALTER TABLE course_schedule RENAME COLUMN course_id_new TO course_id;

BEGIN TRANSACTION;
ALTER TABLE course DROP CONSTRAINT course_pkey;
ALTER TABLE course DROP COLUMN id;
ALTER TABLE course RENAME COLUMN uuid_id TO id;
ALTER TABLE course ADD CONSTRAINT course_pkey PRIMARY KEY ("id");
COMMIT TRANSACTION;

ALTER TABLE course_evaluation_answers
    ADD CONSTRAINT course_evaluation_answers_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE course_invites
    ADD CONSTRAINT course_invites_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE course_leader
    ADD CONSTRAINT course_leader_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE course_module
    ADD CONSTRAINT course_module_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE course_participant
    ADD CONSTRAINT course_participant_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE course_schedule
    ADD CONSTRAINT course_schedule_course_id_fkey
        FOREIGN KEY ("course_id")
            REFERENCES course
                ("id") ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE course_evaluation_answers ALTER COLUMN "course_id" SET NOT NULL;
ALTER TABLE course_invites ALTER COLUMN "course_id" SET NOT NULL;
ALTER TABLE course_leader ALTER COLUMN "course_id" SET NOT NULL;
ALTER TABLE course_module ALTER COLUMN "course_id" SET NOT NULL;
ALTER TABLE course_participant ALTER COLUMN "course_id" SET NOT NULL;
ALTER TABLE course_schedule ALTER COLUMN "course_id" SET NOT NULL;

DROP SEQUENCE course_id_seq;
