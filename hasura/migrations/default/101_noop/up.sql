-- This migration is a noop one, added as a checkpoint after the huge initial migration 100_init.
-- When doing a up-down-up in the CI, we can down till this (101) version and then back up to make sure
-- the PR's up/down migration scripts are correct

SELECT 1;
