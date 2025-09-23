update course_pricing
set xero_code = 'ADV.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED_TRAINER'
and blended = false
and reaccreditation = false;

update course_pricing
set xero_code = 'ADV.RE.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED_TRAINER'
and blended = false
and reaccreditation = true;

update course_pricing
set xero_code = 'ADVMOD.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED'
and blended = false
and reaccreditation = false;

update course_pricing
set xero_code = 'ADVMOD.RE.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED'
and blended = false
and reaccreditation = true;

