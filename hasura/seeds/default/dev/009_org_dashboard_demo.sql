insert into "profile" (id, _given_name, _family_name, _email)
values ('117c12fc-d7c6-4987-9841-a499765ade4b', 'Krista', 'Kuhn', 'krista.kuhn@somethingwhatever.com'),
       ('95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'Curtis', 'Ondricka', 'curtis.ondricka@somethingwhatever.com'),
       ('b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'Tim', 'Hintz', 'tim.hintz@somethingwhatever.com'),
       ('38290d3f-7614-44be-ac70-cd0db7b71b1e', 'Levi', 'Tromp', 'levi.tromp@somethingwhatever.com'),
       ('a63484d5-efcc-4f53-bc4e-86c6e9852e8d', 'Rachael', 'Dicki', 'rachael.dicki@somethingwhatever.com'),
       ('85687c6e-d8a4-4e98-a47e-a66c8059919b', 'Ralph', 'Smith', 'ralph.smith@somethingwhatever.com'),
       ('49f34a78-a73d-46c3-a17f-5cee00feb1ca', 'Martin', 'Cartwright', 'martin.cartwright@somethingwhatever.com');

insert into "course_certificate" (profile_id, course_level, course_name, number, expiry_date, certification_date, is_revoked)
values
    ('117c12fc-d7c6-4987-9841-a499765ade4b', 'LEVEL_2', 'Positive Behaviour Training: Level Two', 'CL-L2-12345', NOW() + interval '12 months', NOW() - interval '12 months', false),
    ('117c12fc-d7c6-4987-9841-a499765ade4b', 'ADVANCED', 'Positive Behaviour Training: Advanced Modules', 'CL-ADV-14001', NOW() - interval '5 days', NOW() - interval '24 months', false),
    ('95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'LEVEL_2', 'Positive Behaviour Training: Level Two', 'CL-L2-12346', NOW() + interval '12 months', NOW() - interval '12 months', false),
    ('95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'ADVANCED', 'Positive Behaviour Training: Advanced Modules', 'CL-ADV-14002', NOW() - interval '5 days', NOW() - interval '24 months', false),
    ('b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'INTERMEDIATE_TRAINER', 'Positive Behaviour Training: Intermediate Trainer', 'CL-INT-12300', NOW() + interval '12 months', NOW() - interval '12 months', false),
    ('38290d3f-7614-44be-ac70-cd0db7b71b1e', 'INTERMEDIATE_TRAINER', 'Positive Behaviour Training: Intermediate Trainer', 'CL-INT-12301', NOW() - interval '20 days', NOW() - interval '24 months', false),
    ('38290d3f-7614-44be-ac70-cd0db7b71b1e', 'LEVEL_2', 'Positive Behaviour Training: Level Two', 'CL-L2-12347', NOW() + interval '5 months', NOW() - interval '17 months', false),
    ('38290d3f-7614-44be-ac70-cd0db7b71b1e', 'ADVANCED', 'Positive Behaviour Training: Advanced Modules', 'CL-ADV-14003', NOW() + interval '8 days', NOW() - interval '24 months', false),
    ('85687c6e-d8a4-4e98-a47e-a66c8059919b', 'LEVEL_1', 'Positive Behaviour Training: Level One', 'CL-L1-12101', NOW() + interval '6 months', NOW() - interval '18 months', false),
    ('49f34a78-a73d-46c3-a17f-5cee00feb1ca', 'LEVEL_1', 'Positive Behaviour Training: Level One', 'CL-L1-12102', NOW() + interval '1 day', NOW() - interval '12 months', false);

insert into "organization" (id, name, address, attributes, sector, trust_type, trust_name)
values ('d787defd-481c-414b-95ff-ecbcc12ae500',
        'Park Community School',
        '{
          "city": "Birmingham",
          "line1": "Minerva Centre Thornthwaite close",
          "line2": "Frankley",
          "country": "United Kingdom",
          "postCode": "B45 0DS"
        }',
        '{
          "email": "info@kenningtons.co.uk.test",
          "phone": "+44 161 496 0330",
          "website": "www.cob.com",
          "headTitle": "District Division Specialist",
          "headLastName": "Dibbert",
          "ofstedRating": "GOOD",
          "headFirstName": "Elvie",
          "localAuthority": "Kingston upon Hull, City of",
          "ofstedLastInspection": "2020-08-11T10:11:57.000Z",
          "headPreferredJobTitle": "Boss"
        }',
        'Healthcare', 'MULTI_ACADEMY_TRUST', 'Kenningtons Primary Academy');

insert into "organization_member" (organization_id, profile_id, is_admin)
values ('d787defd-481c-414b-95ff-ecbcc12ae500', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', true),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', '117c12fc-d7c6-4987-9841-a499765ade4b', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', '38290d3f-7614-44be-ac70-cd0db7b71b1e', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', 'a63484d5-efcc-4f53-bc4e-86c6e9852e8d', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', '85687c6e-d8a4-4e98-a47e-a66c8059919b', false),
       ('d787defd-481c-414b-95ff-ecbcc12ae500', '49f34a78-a73d-46c3-a17f-5cee00feb1ca', false);

insert into "course" (id, organization_id, course_type, course_delivery_type, course_level, name, course_status, accredited_by)
values
(20123, 'd787defd-481c-414b-95ff-ecbcc12ae500', 'CLOSED', 'F2F', 'ADVANCED', 'Positive Behaviour Training: Advanced Modules', 'SCHEDULED', 'ICM');

insert into "course_schedule" (course_id, start, "end", venue_id)
values (20123, NOW() + interval '30 days', NOW() + interval '35 days', 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

insert into "course_trainer" (course_id, profile_id, type, status)
values (20123, 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'LEADER', 'ACCEPTED');

insert into "course_participant" (course_id, profile_id)
values (20123, '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed');
