INSERT INTO public.organization (id, name, address, trust_type, trust_name)
VALUES ('a24397aa-b059-46b9-a728-955580823ce4', 'Team Teach',
        '{"city": "London", "line1": "Second Floor, Longbow House", "line2": "20 Chiswell Street", "country": "United Kingdom", "postCode": "EC1Y 4TW"}',
        'NOT_APPLICABLE', '-');

INSERT INTO public.profile (id, _given_name, _family_name, _email) VALUES
('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'TeamTeach', 'Org-Admin', 'tt.org.adm@teamteach.testinator.com'),
('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'TeamTeach', 'Advanced-Trainer', 'tt.adv.trainer@teamteach.testinator.com'),
('749791ef-e4c4-4a5f-881a-461e4724138d', 'TeamTeach', 'Intermediate-Trainer', 'tt.int.trainer@teamteach.testinator.com'),
('6ea4e91b-9856-4533-9544-949caba236fb', 'TeamTeach', 'Exp-Adv-Trainer', 'tt.expired.adv.trainer@teamteach.testinator.com'),
('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', 'TeamTeach', 'Exp-Int-Trainer', 'tt.expired.int.trainer@teamteach.testinator.com'),
('88072bb2-10e0-4417-b9ce-ec05265b8b56', 'TeamTeach', 'Principal-Trainer', 'tt.principal.trainer@teamteach.testinator.com'),
('dccd780a-9745-4972-a43e-95ec3ef361df', 'TeamTeach', 'Senior-Trainer', 'tt.senior.trainer@teamteach.testinator.com');

INSERT INTO public.identity (profile_id, provider_id, type) VALUES
('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', '185a79fd-6294-46b5-97d2-beebaee5e355', 'cognito'),
('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', 'c1a2b5ce-eec7-4827-a781-f86a20acc2c3', 'cognito'),

('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', '0b6fe2b3-3254-4a83-97e2-5e0ff91fd5ca', 'cognito'),
('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', '092155d5-e837-4a56-a1d4-36c05f84f14b', 'cognito'),

('749791ef-e4c4-4a5f-881a-461e4724138d', '5febe03a-74dd-4317-8063-dfc9a7da3871', 'cognito'),
('749791ef-e4c4-4a5f-881a-461e4724138d', '4676c08a-2eb7-44ab-bf54-a435b49eddec', 'cognito'),

('6ea4e91b-9856-4533-9544-949caba236fb', '65b3becd-512b-4a7d-99ad-653b0f6afac3', 'cognito'),
('6ea4e91b-9856-4533-9544-949caba236fb', 'a46f119a-b3ce-4c7f-90bd-97cb52c96608', 'cognito'),

('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', '5b4a7273-4e8d-421f-80b1-5814f54f2300', 'cognito'),
('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', 'b449aa5d-b7fb-470a-984a-bdca4585b0ed', 'cognito'),

('88072bb2-10e0-4417-b9ce-ec05265b8b56', 'f2c1476a-d34a-4add-86e2-ec8ecda4d9a8', 'cognito'),
('88072bb2-10e0-4417-b9ce-ec05265b8b56', '4fcb85e0-86be-401d-96c2-6b75ee70ad1f', 'cognito'),

('dccd780a-9745-4972-a43e-95ec3ef361df', '567ccb5b-a36d-469f-a25e-66edd10bf253', 'cognito'),
('dccd780a-9745-4972-a43e-95ec3ef361df', '9482f354-1cfb-466c-8b3c-98ee8c7137af', 'cognito');

INSERT INTO public.organization_member (organization_id, profile_id, is_admin) VALUES
('a24397aa-b059-46b9-a728-955580823ce4', '467b4ac5-d86e-40ee-b25f-87e4ed2ce618', true),
('a24397aa-b059-46b9-a728-955580823ce4', '5dd7b79c-9ef2-4712-833e-e2f12bdd672d', false),
('a24397aa-b059-46b9-a728-955580823ce4', '749791ef-e4c4-4a5f-881a-461e4724138d', false),
('a24397aa-b059-46b9-a728-955580823ce4', '6ea4e91b-9856-4533-9544-949caba236fb', false),
('a24397aa-b059-46b9-a728-955580823ce4', '30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', false),
('a24397aa-b059-46b9-a728-955580823ce4', '88072bb2-10e0-4417-b9ce-ec05265b8b56', false),
('a24397aa-b059-46b9-a728-955580823ce4', 'dccd780a-9745-4972-a43e-95ec3ef361df', false);

INSERT INTO public.profile_role (profile_id, role_id) VALUES
-- trainers
('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('749791ef-e4c4-4a5f-881a-461e4724138d', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('6ea4e91b-9856-4533-9544-949caba236fb', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('88072bb2-10e0-4417-b9ce-ec05265b8b56', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
('dccd780a-9745-4972-a43e-95ec3ef361df', '2ad2c32a-0cca-42cf-b456-fa68af0aa55f'),
-- users
('467b4ac5-d86e-40ee-b25f-87e4ed2ce618', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('749791ef-e4c4-4a5f-881a-461e4724138d', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('6ea4e91b-9856-4533-9544-949caba236fb', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('88072bb2-10e0-4417-b9ce-ec05265b8b56', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('dccd780a-9745-4972-a43e-95ec3ef361df', '151f0884-a8c8-48e2-a619-c4434864ea67');

INSERT INTO public.course_certificate (profile_id, number, expiry_date, course_name, course_level, certification_date, is_revoked) VALUES
-- tt.adv.trainer@teamteach.testinator.com
('5dd7b79c-9ef2-4712-833e-e2f12bdd672d', 'CL-ADV-90000-1', NOW() + interval '12 months', 'Positive Behaviour Training: Advanced Modules', 'ADVANCED_TRAINER', NOW() - interval '12 months', false),
-- tt.int.trainer@teamteach.testinator.com
('749791ef-e4c4-4a5f-881a-461e4724138d', 'CL-INT-80000-1', NOW() + interval '12 months', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false),
-- tt.expired.adv.trainer@teamteach.testinator.com
('6ea4e91b-9856-4533-9544-949caba236fb', 'CL-ADV-90000-2', NOW() - interval '10 days', 'Positive Behaviour Training: Advanced Modules', 'ADVANCED_TRAINER', NOW() - interval '12 months', false),
('6ea4e91b-9856-4533-9544-949caba236fb', 'CL-INT-80000-2', NOW() + interval '12 months', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false),
-- tt.expired.int.trainer@teamteach.testinator.com
('30f8fdda-a7ec-44d5-afa0-26d5147d0ea5', 'CL-INT-80000-3', NOW() - interval '10 days', 'Positive Behaviour Training: Intermediate Trainer', 'INTERMEDIATE_TRAINER', NOW() - interval '12 months', false),
-- tt.principal.trainer@teamteach.testinator.com
('88072bb2-10e0-4417-b9ce-ec05265b8b56', 'CL-ADV-90000-3', NOW() + interval '12 months', 'Positive Behaviour Training: Advanced Modules', 'ADVANCED_TRAINER', NOW() - interval '12 months', false),
-- tt.senior.trainer@teamteach.testinator.com
('dccd780a-9745-4972-a43e-95ec3ef361df', 'CL-ADV-90000-4', NOW() + interval '12 months', 'Positive Behaviour Training: Advanced Modules', 'ADVANCED_TRAINER', NOW() - interval '12 months', false);

INSERT INTO public.profile_trainer_role_type (profile_id, trainer_role_type_id) VALUES
('88072bb2-10e0-4417-b9ce-ec05265b8b56', (SELECT id FROM public.trainer_role_type WHERE name = 'principal')),
('dccd780a-9745-4972-a43e-95ec3ef361df', (SELECT id FROM public.trainer_role_type WHERE name = 'senior')),
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', (SELECT id FROM public.trainer_role_type WHERE name = 'moderator')),
('921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', (SELECT id FROM public.trainer_role_type WHERE name = 'moderator'));
