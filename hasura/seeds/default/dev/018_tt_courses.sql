insert into public.course (name, course_type, course_delivery_type, course_level, organization_id, reaccreditation,
                           course_status, min_participants, max_participants, grading_confirmed, go1_integration, id,
                           booking_contact_profile_id, free_spaces, account_code, cancellation_reason,
                           cancellation_fee, grading_started, modules_duration, accredited_by)
values ('Positive Behaviour Training: Level One ', 'CLOSED', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 6, false, false, 10026, 'dccd780a-9745-4972-a43e-95ec3ef361df', 0, '810A Jul23', null, null, false, 305, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'OPEN', 'F2F', 'LEVEL_1', null, false, 'SCHEDULED', 5, 8, false,
        false, 10025, null, null, '810A Apr23', null, null, false, 315, 'ICM'),
       ('Positive Behaviour Training: Advanced Modules ', 'CLOSED', 'F2F', 'ADVANCED',
        'a24397aa-b059-46b9-a728-955580823ce4', false, 'CANCELLED', 6, 5, false, false, 10024,
        'dccd780a-9745-4972-a43e-95ec3ef361df', 0, '810A Feb23',
        'Wrong course date.', 25, false, 540, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'INDIRECT', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 9, false, false, 10023, null, 0, '810A Dec23', null, null, false, 305, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'OPEN', 'F2F', 'LEVEL_1', null, false, 'SCHEDULED', 5, 10, false,
        false, 10022, null, null, '810A Apr23', null, null, false, 305, 'ICM'),
       ('Positive Behaviour Training: Intermediate Trainer ', 'OPEN', 'F2F', 'INTERMEDIATE_TRAINER', null, false,
        'CONFIRM_MODULES', 3, 10, false, false, 10021, null, null, '810A Jun23', null, null, false, 0, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'OPEN', 'F2F', 'LEVEL_1', null, false, 'TRAINER_MISSING', 5, 10,
        false, false, 10020, null, null, '810A Jun23', null, null, false, 0, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'INDIRECT', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'EVALUATION_MISSING', 6, 20, true, false, 10019, null, 0, '810A Nov22', null, null, true, 305,
        'ICM'),
       ('Positive Behaviour Training: Level One ', 'CLOSED', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'TRAINER_PENDING', 6, 5, false, false, 10018, '467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 0, '810A Feb23', null, null, false, 0, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'INDIRECT', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'DECLINED', 6, 5, false, false, 10017, null, 0, '810A Jan23', null, null, false, 315, 'ICM'),
       ('Positive Behaviour Training: Level Two ', 'INDIRECT', 'F2F', 'LEVEL_2', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'CANCELLED', 6, 20, false, false, 10016, null, 0, '810A Jan23', 'Changed my mind.', null, false,
        480, 'ICM'),
       ('Positive Behaviour Training: Advanced Modules ', 'INDIRECT', 'F2F', 'ADVANCED',
        'a24397aa-b059-46b9-a728-955580823ce4', false, 'EXCEPTIONS_APPROVAL_PENDING', 6, 5, false, false, 10015, null,
        0, '810A May23', null, null, false, 455, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'INDIRECT', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 6, false, false, 10014, null, 0, '810A Feb23', null, null, false, 305, 'ICM'),
       ('Positive Behaviour Training: Level One ', 'OPEN', 'F2F', 'LEVEL_1', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'EVALUATION_MISSING', 6, 6, true, false, 10085, null, 0, '810A Feb23', null, null, false, 305, 'ICM'),
       ('Positive Behaviour Training: Advanced Trainer ', 'CLOSED', 'F2F', 'ADVANCED_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'EVALUATION_MISSING', 6, 20, true, false, 10086, null, 0, '810A Nov22', null, null, true, 305,
        'ICM'),
       ('Positive Behaviour Training: Intermediate Trainer ', 'CLOSED', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'EVALUATION_MISSING', 6, 20, true, false, 10087, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
        /* TTHP-1571 trainer@teamteach.testinator.com - Leader */
       ('TTHP-1571 - Anxiety Resistance Training: Intermediate Trainer', 'OPEN', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10088, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       ('TTHP-1571 - PTSD Recuperation Training: Intermediate Trainer', 'CLOSED', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10089, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       ('TTHP-1571 - Mental Health Awarness Training: Intermediate Trainer', 'INDIRECT', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10090, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       /* TTHP-1571 trainer@teamteach.testinator.com - Assistant */
       ('TTHP-1571 - OCD/ADHD/BPD Training: Intermediate Trainer', 'INDIRECT', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10091, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       /* TTHP-1571 org.adm@teamteach.testinator.com - Org Admin */
       ('TTHP-1571 - Rejuvenating Techniques Training: Intermediate Trainer', 'OPEN', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10092, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       ('TTHP-1571 - Anger Management Solutions: Intermediate Trainer', 'CLOSED', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10093, null, 0, '810A Nov22', null, null, true, 305, 'ICM'),
       ('TTHP-1571 - Closing Communication Gap Training: Intermediate Trainer', 'INDIRECT', 'F2F', 'INTERMEDIATE_TRAINER', 'a24397aa-b059-46b9-a728-955580823ce4',
        false, 'SCHEDULED', 6, 20, true, false, 10094, null, 0, '810A Nov22', null, null, true, 305,
        'ICM');

SELECT setval('course_id_seq', 11000);

update public.course set booking_contact_profile_id = '6407ca25-d1d2-4a3d-863a-4b2a0a56c0e4' where id = 10026;

insert into public.course_audit (course_id, authorized_by, type, payload)
values (10016, '749791ef-e4c4-4a5f-881a-461e4724138d', 'CANCELLATION', '{"reason": "Changed my mind.", "cancellation_fee_percent": ""}'),
       (10024, '22015a3e-8907-4333-8811-85f782265a63', 'RESCHEDULE', '{"reason": "Wrong course date.", "cancellation_fee_percent": "25"}'),
       (10008, '13a223a8-2184-42f1-ba37-b49e115e59a2', 'REJECTED', '{"reason": "I dont like it"}'),
       (10084, 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'APPROVED', '{"reason": "Nice course. Keep it up!"}');
       
insert into public.course_cancellation_request (course_id, requested_by, reason)
values (10026, '467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'Wrong venue.');

insert into public.course_certificate (id, course_id, number, expiry_date, profile_id, course_name, course_level,
                                       certification_date, is_revoked, blended_learning, reaccreditation, course_accredited_by)
values ('1e345ec4-f99f-4ce7-b765-ee2d36d7f338', 10019, 'L1.F.INDR.10019', '2025-12-06', '2e06729d-7436-427a-a5cf-ff7c9496b85c', 'Positive Behaviour Training: Level One ', 'LEVEL_1', '2022-12-06', false, false, false, 'ICM'),
       ('1fc58c17-0eae-40ff-81fb-b33daaf474c8', 10019, 'L1.F.INDR.10019', '2025-12-06', 'b5702c04-35a6-4c55-b24a-592dc0a05142', 'Positive Behaviour Training: Level One ', 'LEVEL_1', '2022-12-06', false, false, false, 'ICM'),
       ('c10eee83-dc6d-426d-af21-cf46a6202751', 10019, 'L1.F.INDR.10019', '2025-12-06', 'ae8f617c-2411-42aa-9501-f2f08b16a76e', 'Positive Behaviour Training: Level One ', 'LEVEL_1', '2022-12-06', false, false, false, 'ICM'),
       ('919645da-1eb0-4862-a1f4-6cf06558f61f', 10019, 'L1.F.INDR.10019', '2025-12-06', '47b5b128-0a47-4094-86f6-87005eb12d71', 'Positive Behaviour Training: Level One ', 'LEVEL_1', '2022-12-06', false, false, false, 'ICM'),
       ('df5b8cab-f132-4936-bb66-9219b3f0a6b9', 10019, 'L1.F.INDR.10019', '2025-12-06', 'fbe6eb48-ad58-40f9-9388-07e743240ce3', 'Positive Behaviour Training: Level One ', 'LEVEL_1', '2022-12-06', false, false, false, 'ICM'),
       ('54eba8c3-6355-4d96-8649-fe793f7f0983', 10085, 'F.L1.OP.10085', '2022-12-06', 'fbe6eb48-ad58-40f9-9388-07e743240ce3',   'Positive Behaviour Training: Level One ', 'LEVEL_1', '2019-12-06', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f331', 10086, 'ADV.F.CL.10086',  NOW() + interval '12 months', '5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f332', 10086, 'ADV.F.CL.10086',  NOW() + interval '12 months', '6ea4e91b-9856-4533-9544-949caba236fb', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f333', 10086, 'ADV.F.CL.10086',  NOW() + interval '12 months', '88072bb2-10e0-4417-b9ce-ec05265b8b56', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f334', 10086, 'ADV.F.CL.10086',  NOW() + interval '12 months', 'dccd780a-9745-4972-a43e-95ec3ef361df', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f335', 10087, 'INT.F.CL.10087',  NOW() - interval '5 days', '749791ef-e4c4-4a5f-881a-461e4724138d', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f336', 10087, 'INT.F.CL.10087',  NOW() + interval '12 months', '6ea4e91b-9856-4533-9544-949caba236fb', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM'),
       ('1e345ec4-f99f-4ce7-b765-ee2d36d7f337', 10087, 'INT.F.CL.10087',  NOW() + interval '12 months', '30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false, false, false, 'ICM');

insert into public.course_invites (status, email, course_id)
values ('PENDING', 'rosemary12@teamteach.testinator.com', 10014),
       ('PENDING', 'arlo.dibbert40@teamteach.testinator.com', 10014),
       ('PENDING', 'guiseppe.bogan15@teamteach.testinator.com', 10014),
       ('PENDING', 'nicola_simonis@teamteach.testinator.com', 10014),
       ('PENDING', 'rylee_lang@teamteach.testinator.com', 10014),
       ('ACCEPTED', 'john.doe@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'apolonija.deo@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'zaman.wilt@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'balbus.linde@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'linwood.darien@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'cheyanne.kathryn@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'cassandra.jess@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'jorie.nolene@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'lynda.claud@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'maxene.netta@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'lilac.reuben@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'audrea.nona@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'henrietta.dewey@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'lotus.mimi@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'deacon.hope@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'coby.bert@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'khloe.izzy@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'bryan.chuckie@teamteach.testinator.com', 10019),
       ('PENDING', 'stacey.liptak@teamteach.testinator.com', 10019),
       ('PENDING', 'james.phenlan@teamteach.testinator.com', 10019),
       ('PENDING', 'charles.scanlon@teamteach.testinator.com', 10019),
       ('DECLINED', 'timothy.murphy@teamteach.testinator.com', 10019),
       ('DECLINED', 'marquis.pappas@teamteach.testinator.com', 10019),
       ('ACCEPTED', 'lilac.reuben@teamteach.testinator.com', 10085),
       ('ACCEPTED', 'tt.adv.trainer@teamteach.testinator.com', 10086),
       ('ACCEPTED', 'tt.expired.adv.trainer@teamteach.testinator.com', 10086),
       ('ACCEPTED', 'tt.principal.trainer@teamteach.testinator.com', 10086),
       ('ACCEPTED', 'tt.senior.trainer@teamteach.testinator.com', 10086),
       ('ACCEPTED', 'tt.int.trainer@teamteach.testinator.com', 10087),
       ('ACCEPTED', 'tt.expired.adv.trainer@teamteach.testinator.com', 10087),
       ('ACCEPTED', 'tt.expired.int.trainer@teamteach.testinator.com', 10087);

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10014 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10015 as course_id
from public.module
where module.course_level = 'ADVANCED';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10016 as course_id
from public.module
where module.course_level = 'LEVEL_2';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10017 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10018 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10019 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10020 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10021 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10022 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10023 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10024 as course_id
from public.module
where module.course_level = 'ADVANCED';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10025 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10026 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10085 as course_id
from public.module
where module.course_level = 'LEVEL_1';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10086 as course_id
from public.module
where module.course_level = 'ADVANCED_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10087 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10088 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10089 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10090 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10091 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';

insert into public.course_module (module_id, course_id)
select module.id as module_id, 10092 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';


insert into public.course_module (module_id, course_id)
select module.id as module_id, 10093 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';


insert into public.course_module (module_id, course_id)
select module.id as module_id, 10094 as course_id
from public.module
where module.course_level = 'INTERMEDIATE_TRAINER';


insert into public.course_participant (booking_date, profile_id, attended, grading_feedback, grade, date_graded, course_id, certificate_id, hs_consent)
values ('2022-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'FAIL', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, 'Some note here? Maybe?', 'OBSERVE_ONLY', '2022-12-06 11:43:48.227000 +00:00', 10019, '1e345ec4-f99f-4ce7-b765-ee2d36d7f338', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, 'Some note here? Maybe?', 'OBSERVE_ONLY', '2022-12-06 11:43:48.227000 +00:00', 10019, '1fc58c17-0eae-40ff-81fb-b33daaf474c8', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', '11935252-570f-42ef-a141-5cdf8f78270d', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', '41e9fa1d-0712-43cd-8571-bbf219ab016b', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', '43ead544-671c-46fb-ba8f-b5858c83a2d8', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', '6896b053-0d36-45b4-889c-9472d846c4a1', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, null, false),
       ('2022-12-06 12:42:07.622554 +00:00', 'ae8f617c-2411-42aa-9501-f2f08b16a76e', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, 'c10eee83-dc6d-426d-af21-cf46a6202751', false),
       ('2022-12-06 12:42:07.622554 +00:00', '47b5b128-0a47-4094-86f6-87005eb12d71', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, '919645da-1eb0-4862-a1f4-6cf06558f61f', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'fbe6eb48-ad58-40f9-9388-07e743240ce3', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10019, 'df5b8cab-f132-4936-bb66-9219b3f0a6b9', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'fbe6eb48-ad58-40f9-9388-07e743240ce3', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10085, '54eba8c3-6355-4d96-8649-fe793f7f0983', false),
       ('2022-12-06 12:42:07.622554 +00:00', '5dd7b79c-9ef2-4712-833e-e2f12bdd672d', true, '', 'PASS','2022-12-06 11:43:48.227000 +00:00', 10086, '1e345ec4-f99f-4ce7-b765-ee2d36d7f331', false),
       ('2022-12-06 12:42:07.622554 +00:00', '6ea4e91b-9856-4533-9544-949caba236fb', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10086, '1e345ec4-f99f-4ce7-b765-ee2d36d7f332', false),
       ('2022-12-06 12:42:07.622554 +00:00', '88072bb2-10e0-4417-b9ce-ec05265b8b56', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10086, '1e345ec4-f99f-4ce7-b765-ee2d36d7f333', false),
       ('2022-12-06 12:42:07.622554 +00:00', 'dccd780a-9745-4972-a43e-95ec3ef361df', true, '', 'PASS','2022-12-06 11:43:48.227000 +00:00', 10086, '1e345ec4-f99f-4ce7-b765-ee2d36d7f334', false),
       ('2022-12-06 12:42:07.622554 +00:00', '749791ef-e4c4-4a5f-881a-461e4724138d', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10087, '1e345ec4-f99f-4ce7-b765-ee2d36d7f335', false),
       ('2022-12-06 12:42:07.622554 +00:00', '6ea4e91b-9856-4533-9544-949caba236fb', true, '', 'PASS', '2022-12-06 11:43:48.227000 +00:00', 10087, '1e345ec4-f99f-4ce7-b765-ee2d36d7f336', false),
       /* TTHP-1571 - Open Course, Lead Trainer */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10088, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10088, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10088, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10088, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10088, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Closed Course, Lead Trainer */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10089, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10089, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10089, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10089, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10089, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Indirect Course, Lead Trainer */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10090, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10090, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10090, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10090, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10090, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Indirect Course, Assist Trainer */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10091, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10091, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10091, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10091, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10091, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Open Course, Org Admin */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10092, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10092, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10092, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10092, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10092, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Closed Course, Org Admin */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10093, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10093, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10093, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10093, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10093, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       /* TTHP-1571 - Indirect Course, Org Admin */
       ('2024-12-06 12:42:07.622554 +00:00', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10094, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '2e06729d-7436-427a-a5cf-ff7c9496b85c', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10094, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'b5702c04-35a6-4c55-b24a-592dc0a05142', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10094, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', 'fdedead5-1218-4332-8199-8b2bdce414a7', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10094, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false),
       ('2024-12-06 12:42:07.622554 +00:00', '13a223a8-2184-42f1-ba37-b49e115e59a2', true, '', 'PASS','2024-12-06 11:43:48.227000 +00:00', 10094, '1e345ec4-f99f-4ce7-b765-ee2d36d7f337', false);

INSERT INTO public.course_participant_module (course_participant_id, module_id, completed)
SELECT participant.id as course_participant_id, module.id as module_id, TRUE as completed
FROM public.course_participant participant
         JOIN public.course course ON participant.course_id = course.id
         JOIN public.course_module cmodule ON cmodule.course_id = course.id
         JOIN public.module module ON cmodule.module_id = module.id
WHERE course.id IN (10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10085, 10086, 10087, 10088, 10089, 10090, 10091, 10092, 10093, 10094);

insert into public.venue (id, name, geo_coordinates, city, address_line_one, address_line_two, post_code,
                          google_places_id)
values ('b936752f-52fc-4d82-a212-90105a51c05e', 'London School of Economics and Political Science',
        '(51.5144388,-0.1164513)', 'Greater London', 'Houghton St', null, 'WC2A 2AE',
        'ChIJWwWza3sadkgR77gsD5ccs70'),
       ('84daabd8-359f-4497-a421-293e95ae9a70', 'London Academy of Excellence Tottenham',
        '(51.60572939999999,-0.06638010000000001)', 'Greater London',
        'Lilywhite House, 780 High Rd', null, 'N17 0BX', 'ChIJS7qCPJkedkgRq5TrG1YF0Is'),
       ('0a6e3839-b28f-4042-b42c-27d62fc1f92d', 'Barlows Primary School', '(53.468886,-2.9402807)', 'Merseyside',
        'Barlow''s Ln, Fazakerley', null, 'L9 9EH', 'ChIJA9sfnU8ie0gRTktxTrgWVnw'),
       ('a7013539-a2c5-44cb-a014-e07598647648', 'London School of Barbering - Liverpool Street',
        '(51.5185185,-0.0787479)', 'Greater London', '13 Artillery Ln', null, 'E1 7HY',
        'ChIJYx_Vnp0ddkgR5sZdvWuAQjs'),
       ('cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 'Glasgow School of Sport', '(55.8467257,-4.299916899999999)',
        'Glasgow City', '30 Gower Terrace', null, 'G41 5QE',
        'ChIJC_cuN3BGiEgRPhAolcA28Vc');

insert into public.course_schedule (start, "end", venue_id, course_id)
values (date(now()) + time '09:00' + interval '3 month', date(now()) + time '17:00' + interval '3 month', 'b936752f-52fc-4d82-a212-90105a51c05e', 10014),
       (date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', '84daabd8-359f-4497-a421-293e95ae9a70', 10015),
       (date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', '0a6e3839-b28f-4042-b42c-27d62fc1f92d', 10016),
       (date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', '0a6e3839-b28f-4042-b42c-27d62fc1f92d', 10017),
       (date(now()) + time '09:00' + interval '4 month', date(now()) + time '17:00' + interval '4 month', '0a6e3839-b28f-4042-b42c-27d62fc1f92d', 10018),
       (date(now()) + time '09:00' + interval '6 month', date(now()) + time '17:00' + interval '6 month', 'b936752f-52fc-4d82-a212-90105a51c05e', 10020),
       (date(now()) + time '09:00' - interval '1 month', date(now()) + time '17:00' - interval '1 month', '84daabd8-359f-4497-a421-293e95ae9a70', 10019),
       (date(now()) + time '09:00' + interval '7 month', date(now()) + time '17:00' + interval '7 month', '0a6e3839-b28f-4042-b42c-27d62fc1f92d', 10021),
       (date(now()) + time '09:00' + interval '8 month', date(now()) + time '17:00' + interval '8 month', 'a7013539-a2c5-44cb-a014-e07598647648', 10022),
       (date(now()) + time '09:00' + interval '9 month', date(now()) + time '17:00' + interval '9 month', 'a7013539-a2c5-44cb-a014-e07598647648', 10023),
       (date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', 'a7013539-a2c5-44cb-a014-e07598647648', 10024),
       (date(now()) + time '09:00' + interval '10 month', date(now()) + time '17:00' + interval '10 month', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10025),
       (date(now()) + time '09:00' + interval '11 month', date(now()) + time '17:00' + interval '11 month', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10026),
       (date(now()) + time '09:00' - interval '12 months', date(now()) + time '17:00' - interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10085),
       (date(now()) + time '09:00' - interval '12 months', date(now()) + time '17:00' - interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10086),
       (date(now()) + time '09:00' - interval '12 months', date(now()) + time '17:00' - interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10087),
       /* TTHP-1571 - Lead Trainer */
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10088),
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10089),
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10090),
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10091),
       /* TTHP-1571 - Org Admin */
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10092),
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10093),
       (date(now()) + time '09:00' + interval '12 months', date(now()) + time '17:00' + interval '12 months', 'cb7cb6c9-5e59-4fc4-b9d5-028f2bb40ccf', 10094);

insert into public.course_trainer (profile_id, type, course_id, status)
values  ('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'LEADER', 10014, 'ACCEPTED'),
        ('749791ef-e4c4-4a5f-881a-461e4724138d', 'ASSISTANT', 10014, 'ACCEPTED'),
        ('749791ef-e4c4-4a5f-881a-461e4724138d', 'LEADER', 10015, 'ACCEPTED'),
        ('749791ef-e4c4-4a5f-881a-461e4724138d', 'LEADER', 10016, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'ASSISTANT', 10016, 'PENDING'),
        ('749791ef-e4c4-4a5f-881a-461e4724138d', 'LEADER', 10017, 'ACCEPTED'),
        ('88072bb2-10e0-4417-b9ce-ec05265b8b56', 'LEADER', 10018, 'PENDING'),
        ('749791ef-e4c4-4a5f-881a-461e4724138d', 'LEADER', 10019, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10021, 'ACCEPTED'),
        ('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'LEADER', 10022, 'ACCEPTED'),
        ('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'LEADER', 10023, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10024, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10025, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10026, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10085, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10086, 'ACCEPTED'),
        ('dccd780a-9745-4972-a43e-95ec3ef361df', 'LEADER', 10087, 'ACCEPTED'),
        /* TTHP-1571 trainer@teamteach.testinator.com */
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10088, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10089, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'LEADER', 10090, 'ACCEPTED'),
        ('13a223a8-2184-42f1-ba37-b49e115e59a2', 'ASSISTANT', 10091, 'ACCEPTED'),
        /* TTHP-1571 org.adm@teamteach.testinator.com */
        ('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'ASSISTANT', 10092, 'ACCEPTED'),
        ('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'ASSISTANT', 10093, 'ACCEPTED'),
        ('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'ASSISTANT', 10094, 'ACCEPTED');
        