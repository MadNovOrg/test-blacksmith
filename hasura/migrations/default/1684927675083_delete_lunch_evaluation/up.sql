DELETE FROM course_evaluation_answers
WHERE question_id IN (
  SELECT id FROM course_evaluation_questions WHERE question_key = 'LUNCH_REFRESHMENTS'
);

DELETE FROM course_evaluation_questions WHERE question_key = 'LUNCH_REFRESHMENTS';
