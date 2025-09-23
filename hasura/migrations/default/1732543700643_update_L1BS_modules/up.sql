UPDATE module_v2
SET lessons = jsonb_set(lessons, '{items}','[
{"name":"Arm waltz"},
{"name":"Turn Gather Guide"},
{"name":"Half shield"}
]')
WHERE name = 'Level 1 BS Separations';