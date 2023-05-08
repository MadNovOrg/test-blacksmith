insert into "profile" (id, _given_name, _family_name, _email)
values ('117c12fc-d7c6-4987-9841-a499765ade4b', 'Krista', 'Kuhn', 'krista.kuhn@somethingwhatever.com'),
       ('95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'Curtis', 'Ondricka', 'curtis.ondricka@somethingwhatever.com'),
       ('b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'Tim', 'Hintz', 'tim.hintz@somethingwhatever.com'),
       ('38290d3f-7614-44be-ac70-cd0db7b71b1e', 'Levi', 'Tromp', 'levi.tromp@somethingwhatever.com'),
       ('a63484d5-efcc-4f53-bc4e-86c6e9852e8d', 'Rachael', 'Dicki', 'rachael.dicki@somethingwhatever.com'),
       ('85687c6e-d8a4-4e98-a47e-a66c8059919b', 'Ralph', 'Smith', 'ralph.smith@somethingwhatever.com'),
       ('49f34a78-a73d-46c3-a17f-5cee00feb1ca', 'Martin', 'Cartwright', 'martin.cartwright@somethingwhatever.com');

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
(10100, 'd787defd-481c-414b-95ff-ecbcc12ae500', 'CLOSED', 'F2F', 'ADVANCED', 'Positive Behaviour Training: Advanced Modules', 'SCHEDULED', 'ICM');

insert into "course_schedule" (course_id, start, "end", venue_id)
values (10100, NOW() + interval '30 days', NOW() + interval '35 days', 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

insert into "course_trainer" (course_id, profile_id, type, status)
values (10100, 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'LEADER', 'ACCEPTED');

insert into "course_participant" (course_id, profile_id)
values (10100, '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed');


insert into public.course (name, course_type, course_delivery_type, course_level, organization_id, reaccreditation,
                           course_status, min_participants, max_participants, grading_confirmed, go1_integration, id,
                           contact_profile_id, free_spaces, sales_representative_id, account_code, cancellation_reason,
                           cancellation_fee_percent, grading_started, modules_duration, notes, accredited_by, source)
values  ('Positive Behaviour Training: Level Two ', 'CLOSED', 'F2F', 'LEVEL_2', 'd787defd-481c-414b-95ff-ecbcc12ae500',
        false, 'EVALUATION_MISSING', 6, 20, false, false, 10101, null, 0, null, '810A Jan23', 'Changed my mind.', null, false,
        480, null, 'ICM', null),
       ('Positive Behaviour Training: Advanced Modules ', 'CLOSED', 'F2F', 'ADVANCED',
        'd787defd-481c-414b-95ff-ecbcc12ae500', false, 'EVALUATION_MISSING', 6, 5, false, false, 10102, null,
        0, null, '810A May23', null, null, false, 455, null, 'ICM', null),
        ('Positive Behaviour Training: Intermediate Trainer ', 'CLOSED', 'F2F', 'INTERMEDIATE_TRAINER', 'd787defd-481c-414b-95ff-ecbcc12ae500',
        false, 'EVALUATION_MISSING', 6, 20, true, false, 10103, null, 0, null, '810A Nov22', null, null, true, 305,
        null, 'ICM', null),
        ('Positive Behaviour Training: Level One ', 'CLOSED', 'F2F', 'LEVEL_1', 'd787defd-481c-414b-95ff-ecbcc12ae500',
        false, 'EVALUATION_MISSING', 6, 20, true, false, 10104, null, 0, null, '810A Nov22', null, null, true, 305,
        null, 'ICM', null);

insert into public.course_certificate (id, course_id, number, expiry_date, profile_id, course_name, course_level, certification_date, is_revoked)
values ('1e345ec4-f99f-4ce7-b765-ee2d36d7f400', 10101, 'CL-L2-10101-1', NOW() + interval '12 months', '117c12fc-d7c6-4987-9841-a499765ade4b', 'Positive Behaviour Training: Level Two', 'LEVEL_2', NOW() - interval '12 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f401', 10101, 'CL-L2-10101-2', NOW() + interval '12 months', '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'Positive Behaviour Training: Level Two', 'LEVEL_2', NOW() - interval '12 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f402', 10101, 'CL-L2-10101-3', NOW() + interval '12 months', '38290d3f-7614-44be-ac70-cd0db7b71b1e', 'Positive Behaviour Training: Level Two', 'LEVEL_2', NOW() - interval '17 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f403', 10102, 'CL-ADV-10102-1', NOW() - interval '5 days', '117c12fc-d7c6-4987-9841-a499765ade4b', 'Positive Behaviour Training: Advanced Module', 'ADVANCED', NOW() - interval '24 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f404', 10102, 'CL-ADV-10102-2', NOW() - interval '5 days', '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', 'Positive Behaviour Training: Advanced Module ', 'ADVANCED', NOW() - interval '24 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f405', 10102, 'CL-ADV-10102-3', NOW() + interval '8 days', '38290d3f-7614-44be-ac70-cd0db7b71b1e', 'Positive Behaviour Training: Advanced Module ', 'ADVANCED', NOW() - interval '24 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f406', 10103, 'CL-INT-T-10103-1', NOW() + interval '12 months', 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'Positive Behaviour Training: Intermediate Trainer ', 'ADVANCED', NOW() - interval '12 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f407', 10103, 'CL-INT-T-10103-2', NOW() - interval '20 days', '38290d3f-7614-44be-ac70-cd0db7b71b1e', 'Positive Behaviour Training: Intermediate Trainer ', 'ADVANCED', NOW() - interval '24 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f408', 10104, 'CL-L1-10104-1', NOW() + interval '6 months', '85687c6e-d8a4-4e98-a47e-a66c8059919b', 'Positive Behaviour Training: Level One ', 'LEVEL_1', NOW() - interval '18 months', false),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f409', 10104, 'CL-L1-10104-2', NOW() - interval '1 day', '49f34a78-a73d-46c3-a17f-5cee00feb1ca', 'Positive Behaviour Training: Level One ', 'LEVEL_1', NOW() - interval '12 months', false);

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10104 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10102 as course_id
from public.module
where module.course_level = 'ADVANCED';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10101 as course_id
from public.module
where module.course_level = 'LEVEL_2';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10103 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_participant (booking_date, profile_id, attended, grading_feedback, grade, date_graded, course_id, certificate_id, hs_consent)
values ('2022-12-06 12:42:07.622554 +00:00', '117c12fc-d7c6-4987-9841-a499765ade4b', true, '', 'PASS', NOW() - interval '12 months', 10101, '1e345ec4-f99f-4ce7-b765-ee2d36d7f400', false),
       ('2022-12-06 12:42:07.622554 +00:00', '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', true, '', 'PASS', NOW() - interval '12 months', 10101, '1e345ec4-f99f-4ce7-b765-ee2d36d7f401', false),
       ('2022-12-06 12:42:07.622554 +00:00', '38290d3f-7614-44be-ac70-cd0db7b71b1e', true, '', 'PASS', NOW() - interval '17 months', 10101, '1e345ec4-f99f-4ce7-b765-ee2d36d7f402', false),
       ('2022-12-06 12:42:07.622554 +00:00', '117c12fc-d7c6-4987-9841-a499765ade4b', true, '', 'PASS', NOW() - interval '24 months', 10102, '1e345ec4-f99f-4ce7-b765-ee2d36d7f403', false),
       ('2022-12-06 12:42:07.622554 +00:00', '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed', true, '', 'PASS', NOW() - interval '24 months', 10102, '1e345ec4-f99f-4ce7-b765-ee2d36d7f404', false),
       ('2022-12-06 12:42:07.622554 +00:00', '38290d3f-7614-44be-ac70-cd0db7b71b1e', true, '', 'PASS', NOW() - interval '24 months', 10102, '1e345ec4-f99f-4ce7-b765-ee2d36d7f405', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', true, '', 'PASS', NOW() - interval '12 months', 10103, '1e345ec4-f99f-4ce7-b765-ee2d36d7f406', false),
       ('2022-12-06 12:42:07.622554 +00:00', '38290d3f-7614-44be-ac70-cd0db7b71b1e', true, '', 'PASS', NOW() - interval '24 months', 10103, '1e345ec4-f99f-4ce7-b765-ee2d36d7f407', false),
       ('2022-12-06 12:42:07.622554 +00:00', '85687c6e-d8a4-4e98-a47e-a66c8059919b', true, '', 'PASS', NOW() - interval '18 months', 10104, '1e345ec4-f99f-4ce7-b765-ee2d36d7f408', false),
       ('2022-12-06 12:42:07.622554 +00:00', '49f34a78-a73d-46c3-a17f-5cee00feb1ca', true, '', 'PASS', NOW() - interval '12 months', 10104, '1e345ec4-f99f-4ce7-b765-ee2d36d7f409', false);

INSERT INTO public.course_participant_module (course_participant_id, module_id, completed)
SELECT participant.id as course_participant_id, module.id as module_id, TRUE as completed
FROM public.course_participant participant
         JOIN public.course course ON participant.course_id = course.id
         JOIN public.course_module cmodule ON cmodule.course_id = course.id
         JOIN public.module module ON cmodule.module_id = module.id
WHERE course.id IN (10101, 10102, 10103, 10104);

insert into public.course_trainer (profile_id, type, course_id, status)
values  ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10101, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10102, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10103, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10104, 'ACCEPTED');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' - interval '1 month', date(now()) + time '17:00' - interval '1 month', 10101, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now()) + time '09:00' - interval '1 month', date(now()) + time '17:00' - interval '1 month', 10102, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now() + interval '1 day') + time '09:00' - interval '1 month', date(now() - interval '1 day') + time '17:00' + interval '1 month', 10103, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now() + interval '2 days') + time '09:00' - interval '1 month', date(now() - interval '2 days') + time '17:00' + interval '1 month', 10104, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b');