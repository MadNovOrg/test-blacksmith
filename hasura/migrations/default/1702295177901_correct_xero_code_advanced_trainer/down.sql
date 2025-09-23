update course_pricing
set xero_code = 'INT.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED_TRAINER'
and blended = false
and reaccreditation = false;

update course_pricing
set xero_code = 'INT.RE.OP'
where "type" = 'OPEN'
and "level" = 'ADVANCED_TRAINER'
and blended = false
and reaccreditation = true;

update course_pricing
set xero_code = ''
where "type" = 'OPEN'
and "level" = 'ADVANCED'
and blended = false
and reaccreditation = false;

update course_pricing
set xero_code = ''
where "type" = 'OPEN'
and "level" = 'ADVANCED'
and blended = false
and reaccreditation = true;