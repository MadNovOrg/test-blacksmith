UPDATE module_setting 
SET mandatory = true
WHERE module_name IN (
'Theory Level One ANZ',
'Theory Level Two ANZ',
'Theory Level One BS ANZ',
'Physical Warm Up Level One BS ANZ',
'Physical Warm Up Level Two ANZ',
'Physical Warm Up Level One ANZ',
'Elevated Risks Level One ANZ',
'Elevated Risks Level One BS ANZ',
'Elevated Risks Level Two ANZ'
)
AND course_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_1_BS', 'LEVEL_1_NP', 'ADVANCED')
AND course_type IN ('OPEN', 'CLOSED');
