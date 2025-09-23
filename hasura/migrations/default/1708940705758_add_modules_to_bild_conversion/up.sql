insert into module_v2("name", "lessons")
values 
  (
    'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards',
    '{"items": [
        {"name": "Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards"}
    ]}'::jsonb
  ),
  (
    'Working Experience',
    '{"items": [
        {"name": "Working Experience"}
    ]}'::jsonb
  ),
  (
    'Content',
    '{"items": [
        {"name": "Content"}
    ]}'::jsonb
  ),
  (
    'Specific Legislation and Guidance',
    '{"items": [
        {"name": "Specific Legislation and Guidance"}
    ]}'::jsonb
  ),
  (
    'Understanding Training Needs Analysis (TNA)',
    '{"items": [
        {"name": "Understanding Training Needs Analysis (TNA)"}
    ]}'::jsonb
  ),
  (
    'Staff Training in Preventative/Primary Strategies',
    '{"items": [
        {"name": "Staff Training in Preventative/Primary Strategies"}
    ]}'::jsonb
  ),
  (
    'Duty of Care and Duty of Candour',
    '{"items": [
        {"name": "Duty of Care and Duty of Candour"}
    ]}'::jsonb
  ),
  (
    'Peer Reviews',
    '{"items": [
        {"name": "Peer Reviews"}
    ]}'::jsonb
  );

alter table module_setting add column conversion boolean default false;

insert into module_setting(course_level, reaccreditation, go1_integration, conversion, color, course_delivery_type, course_type, module_name, sort, mandatory)
values
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Peer Reviews', 8, true),

  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'OPEN', 'Peer Reviews', 8, true),

  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Peer Reviews', 8, true),

  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Peer Reviews', 8, true),

  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, false, true, 'navy', 'MIXED', 'CLOSED', 'Peer Reviews', 8, true),

  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Content', 3, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_INTERMEDIATE_TRAINER', false, true, true, 'navy', 'MIXED', 'CLOSED', 'Peer Reviews', 8, true),

  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Working Experience', 2, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Content', 3, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Specific Legislation and Guidance', 4, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'OPEN', 'Peer Reviews', 8, true),

  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Content', 3, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_ADVANCED_TRAINER', false, false, true, 'navy', 'F2F', 'CLOSED', 'Peer Reviews', 8, true),

  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 1, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Working Experience', 2, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Content', 3, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Specific Legislation and Guidance', 4, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Understanding Training Needs Analysis (TNA)', 5, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Staff Training in Preventative/Primary Strategies', 6, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Duty of Care and Duty of Candour', 7, true),
  ('BILD_ADVANCED_TRAINER', false, true, true, 'navy', 'F2F', 'CLOSED', 'Peer Reviews', 8, true);
