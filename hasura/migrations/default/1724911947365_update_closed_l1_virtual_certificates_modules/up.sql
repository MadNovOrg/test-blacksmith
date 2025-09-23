UPDATE course_participant
SET graded_on = (
    SELECT jsonb_agg(elem)
    FROM jsonb_array_elements(graded_on) AS elem
    WHERE elem->>'name' IN ('Theory', 'Personal Space & Body Language')
)
FROM course AS c
WHERE c.id = course_participant.course_id
  AND c.course_level = 'LEVEL_1'
  AND c.course_type = 'CLOSED'
  AND c.course_delivery_type = 'VIRTUAL'
  AND graded_on @> '[{"name": "Theory"}, {"name": "Personal Space & Body Language"}]';

UPDATE course
SET curriculum = (
    SELECT jsonb_agg(elem)
    FROM jsonb_array_elements(curriculum) AS elem
    WHERE elem->>'name' IN ('Theory', 'Personal Space & Body Language')
)
WHERE
  course_level = 'LEVEL_1'
  AND course_type = 'CLOSED'
  AND course_delivery_type = 'VIRTUAL'
  AND curriculum @> '[{"name": "Theory"}, {"name": "Personal Space & Body Language"}]';