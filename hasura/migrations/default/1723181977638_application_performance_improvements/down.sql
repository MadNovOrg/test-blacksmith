-- Drop triggers for each relevant table
DROP TRIGGER IF EXISTS update_course_search_field_on_course_change ON course;
DROP TRIGGER IF EXISTS update_course_search_field_on_course_trainer_change ON course_trainer;
DROP TRIGGER IF EXISTS update_course_search_field_on_profile_change ON profile;
DROP TRIGGER IF EXISTS update_course_search_field_on_organization_change ON organization;
DROP TRIGGER IF EXISTS update_course_search_field_on_course_schedule_change ON course_schedule;
DROP TRIGGER IF EXISTS update_course_search_field_on_venue_change ON venue;

-- Drop the trigger functions
DROP FUNCTION IF EXISTS course_search_field_trigger();
DROP FUNCTION IF EXISTS course_trainer_search_field_trigger();
DROP FUNCTION IF EXISTS profile_search_field_trigger();
DROP FUNCTION IF EXISTS organization_search_field_trigger();
DROP FUNCTION IF EXISTS course_schedule_search_field_trigger();
DROP FUNCTION IF EXISTS venue_search_field_trigger();

-- Drop the update function
DROP FUNCTION IF EXISTS update_course_search_fields(INT);

-- Drop the search_fields column from the course table
ALTER TABLE course DROP COLUMN IF EXISTS search_fields;
