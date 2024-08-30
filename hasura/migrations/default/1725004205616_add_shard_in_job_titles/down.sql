DELETE FROM job_title WHERE shard = 'ANZ';
ALTER TABLE job_title DROP COLUMN IF EXISTS shard;
ALTER TABLE job_title ADD CONSTRAINT "job_title_title_key" UNIQUE (title);