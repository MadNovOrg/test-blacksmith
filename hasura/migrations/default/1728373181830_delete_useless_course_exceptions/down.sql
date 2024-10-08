-- No need of down migration
DELETE FROM course_exceptions
USING course
WHERE course_exceptions.course_id = course.id
AND course.course_status != 'EXCEPTIONS_APPROVAL_PENDING';
