delete from module_v2
where name in (
  'Protocols for BILD ACT Certified Training Courses that meet the RRN Training Standards', 
  'Working Experience',
  'Content',
  'Specific Legislation and Guidance',
  'Understanding Training Needs Analysis (TNA)',
  'Staff Training in Preventative/Primary Strategies',
  'Duty of Care and Duty of Candour',
  'Peer Reviews'
);

alter table module_setting drop column conversion;