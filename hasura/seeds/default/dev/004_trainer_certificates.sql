-- add certificates to ADVANCED level course for test trainers
UPDATE course SET max_participants = 25 WHERE id = 10010;

INSERT INTO public.course_invites (id, email, status, course_id) VALUES
('280fe995-03f1-401b-8d74-df7de4c615a7', 'trainer@teamteach.testinator.com', 'ACCEPTED', 10010),
('ea29c054-2e11-448c-a414-4e76b911f63f', 'trainer.with.org@teamteach.testinator.com', 'ACCEPTED', 10010),
('892a4028-ee2c-424d-ae6f-062877697d76', 'trainer.and.user@teamteach.testinator.com', 'ACCEPTED', 10010),
('7b366ee2-371e-41c8-ba40-e5fc742456b0', 'assistant@teamteach.testinator.com', 'ACCEPTED', 10010),
('1ab3cccf-9963-43e7-8523-834c90ff4330', 'assistant.with.org@teamteach.testinator.com', 'ACCEPTED', 10010),
('c09b3c44-fa56-44ed-bbde-91aa451fc99a', 'adm@teamteach.testinator.com', 'ACCEPTED', 10010),
('45aa5e28-237c-48d1-87fa-db4687963a04', 'moderator@teamteach.testinator.com', 'ACCEPTED', 10010),
('fd2804fb-8e1a-41b1-935f-64749f7bb60f', 'trainer01@teamteach.testinator.com', 'ACCEPTED', 10010),
('a70db83f-76dc-4705-844a-2df619a74a27', 'trainer02@teamteach.testinator.com', 'ACCEPTED', 10010),
('f8f581e2-45c0-40a2-8334-38b8ab92f154', 'trainer03@teamteach.testinator.com', 'ACCEPTED', 10010),
('f757f65f-4244-46af-bdbb-4a84caf253c7', 'trainer04@teamteach.testinator.com', 'ACCEPTED', 10010),
('3ecd91d2-01d5-47f6-8a9e-32d278b2bf35', 'trainer05@teamteach.testinator.com', 'ACCEPTED', 10010),
('daf2f1e3-6067-4253-bcc0-7f06e5878c88', 'trainer06@teamteach.testinator.com', 'ACCEPTED', 10010),
('708e4843-c979-4c05-b090-ae3bf7f6344e', 'trainer07@teamteach.testinator.com', 'ACCEPTED', 10010),
('1c355e21-aeb3-4fed-aa6b-2b7118aded11', 'trainer08@teamteach.testinator.com', 'ACCEPTED', 10010),
('84eed7d2-fd96-4766-8039-a60ffd28d697', 'trainer09@teamteach.testinator.com', 'ACCEPTED', 10010),
('53fdaaa2-c1ad-48a3-9bc3-5e36f4bc5251', 'trainer10@teamteach.testinator.com', 'ACCEPTED', 10010),
('a4438fb8-6754-4662-a75b-b256fdce0533', 'merge3.user@teamteach.testinator.com', 'ACCEPTED', 10010);

INSERT INTO public.course_certificate (id, course_id, number, expiry_date, profile_id, course_name, course_level, certification_date, is_revoked) VALUES
('8fc6df34-4468-43c7-8790-57d4861e620e', 10010, 'ADV.F.CL.10010', '2025-05-05', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('e308d269-35f4-4d7e-b5fa-0c5c67205c5b', 10010, 'ADV.F.CL.10010', '2025-05-05', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('888163f5-2f70-4b2e-ba23-89a888b8427d', 10010, 'ADV.F.CL.10010', '2025-05-05', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('0f634aa6-c0ea-44b7-951a-ef8ccfda917b', 10010, 'ADV.F.CL.10010', '2025-05-05', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('bb464dbc-7482-4fb3-a8d3-536376347899', 10010, 'ADV.F.CL.10010', '2025-05-05', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('704d71f0-b0fd-4341-a67f-5031e7ffb56e', 10010, 'ADV.F.CL.10010', '2025-05-05', '22015a3e-8907-4333-8811-85f782265a63', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('0d643560-d9ee-4d21-b3c7-4a812661ae7f', 10010, 'ADV.F.CL.10010', '2025-05-05', '48812860-89a5-41be-95c9-b8889e88bffd', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('daab6138-ef09-48cf-99b9-15fa5735ed15', 10010, 'ADV.F.CL.10010', '2025-05-05', '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('66513502-d712-4528-80e8-470fedc172a4', 10010, 'ADV.F.CL.10010', '2025-05-05', '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('d74938e6-0b80-4207-a6fa-b9f4a5366d97', 10010, 'ADV.F.CL.10010', '2025-05-05', 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('e968acbe-e311-4ed0-aa48-faebbdc496ae', 10010, 'ADV.F.CL.10010', '2025-05-05', 'd54f86ca-0181-4264-8c73-7b73ff395405', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('8a2ca261-0630-4ad2-a211-6069af87bf4a', 10010, 'ADV.F.CL.10010', '2025-05-05', '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('ad8c91ab-17ae-45f6-ac6f-91223bd8d494', 10010, 'ADV.F.CL.10010', NOW() - interval '40 days', '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('b43215ed-ec9d-42cb-b274-a04b1b0b2f50', 10010, 'ADV.F.CL.10010', NOW() - interval '20 days', '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false),
('b43215ed-ec9d-42cb-b274-a04b1b0b2f51', 10010, 'ADV.F.CL.10010', '2025-05-05', '720fce28-3c62-4ca9-ac28-10012bc07663', 'Positive Behaviour Training: Advanced Trainer', 'ADVANCED_TRAINER', '2022-03-03', false);

INSERT INTO public.course_participant (id, course_id, profile_id, invite_id, certificate_id, date_graded, grade) VALUES
('58533453-7c79-4ab8-9b1a-5e7439a2a2cb', 10010,  '13a223a8-2184-42f1-ba37-b49e115e59a2', '280fe995-03f1-401b-8d74-df7de4c615a7', '8fc6df34-4468-43c7-8790-57d4861e620e', '2022-05-05', 'PASS'),
('e9929817-d72f-4c09-a3c7-58f1bb55c578', 10010,  '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'ea29c054-2e11-448c-a414-4e76b911f63f', 'e308d269-35f4-4d7e-b5fa-0c5c67205c5b', '2022-05-05', 'PASS'),
('da7d83f6-a82f-4530-861c-b1eeba3e6040', 10010,  'bb5526c7-198c-4be5-a53a-1177f55c1c5b', '892a4028-ee2c-424d-ae6f-062877697d76', '888163f5-2f70-4b2e-ba23-89a888b8427d', '2022-05-05', 'PASS'),
('4aa7e703-683d-4899-945d-e4d234ba2d55', 10010,  '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', '7b366ee2-371e-41c8-ba40-e5fc742456b0', '0f634aa6-c0ea-44b7-951a-ef8ccfda917b', '2022-05-05', 'PASS'),
('6ef963cf-d884-4c25-867b-ea4a0a1531dc', 10010,  'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', '1ab3cccf-9963-43e7-8523-834c90ff4330', 'bb464dbc-7482-4fb3-a8d3-536376347899', '2022-05-05', 'ASSIST_ONLY'),
('03f972a8-2228-4af5-a320-ecd30ddbb115', 10010,  '22015a3e-8907-4333-8811-85f782265a63', 'c09b3c44-fa56-44ed-bbde-91aa451fc99a', '704d71f0-b0fd-4341-a67f-5031e7ffb56e', '2022-05-05', 'PASS'),
('2650570c-a2d3-45ae-872f-74206801922e', 10010,  '48812860-89a5-41be-95c9-b8889e88bffd', '45aa5e28-237c-48d1-87fa-db4687963a04', '0d643560-d9ee-4d21-b3c7-4a812661ae7f', '2022-05-05', 'PASS'),
('ad81385d-d08e-44d4-b8be-ecf7a2330010', 10010,  '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'fd2804fb-8e1a-41b1-935f-64749f7bb60f', 'daab6138-ef09-48cf-99b9-15fa5735ed15', '2022-05-05', 'PASS'),
('0bd3fe07-0133-4234-a637-84bc252af68a', 10010,  '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'a70db83f-76dc-4705-844a-2df619a74a27', '66513502-d712-4528-80e8-470fedc172a4', '2022-05-05', 'PASS'),
('a50b893a-2b2c-45bd-a856-06a17f909cc1', 10010,  'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'f8f581e2-45c0-40a2-8334-38b8ab92f154', 'd74938e6-0b80-4207-a6fa-b9f4a5366d97', '2022-05-05', 'PASS'),
('eb857022-480e-453a-aee0-99e0ef9daa43', 10010,  'd54f86ca-0181-4264-8c73-7b73ff395405', 'f757f65f-4244-46af-bdbb-4a84caf253c7', 'e968acbe-e311-4ed0-aa48-faebbdc496ae', '2022-05-05', 'PASS'),
('b566da50-8e95-4238-ab51-7c637eff95cd', 10010,  '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', '3ecd91d2-01d5-47f6-8a9e-32d278b2bf35', '8a2ca261-0630-4ad2-a211-6069af87bf4a', '2022-05-05', 'PASS'),
('cfaaa794-90bf-4125-9692-4399248e4533', 10010,  '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'daf2f1e3-6067-4253-bcc0-7f06e5878c88', 'ad8c91ab-17ae-45f6-ac6f-91223bd8d494', '2022-05-05', 'PASS'),
('62b9fd99-75f8-4bcb-9348-4998323a17cc', 10010,  '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', '708e4843-c979-4c05-b090-ae3bf7f6344e', 'b43215ed-ec9d-42cb-b274-a04b1b0b2f50', '2022-05-05', 'PASS'),
('aba178d2-49b5-4644-9c70-a0e7a939b8f0', 10010,  '14184530-d2a8-4cc2-ad42-2b7312aa5b3d', '1c355e21-aeb3-4fed-aa6b-2b7118aded11', null, null, null),
('4c340a8f-b161-4926-b610-c7ecff0d9a43', 10010,  'd7c8cfe9-827c-4fc5-88b6-1a799d02dd81', '84eed7d2-fd96-4766-8039-a60ffd28d697', null, null, null),
('05a01816-e4b4-4b52-adc9-deeb6d7d42a3', 10010,  'b414536d-29dd-4902-81f9-e808503428ee', '53fdaaa2-c1ad-48a3-9bc3-5e36f4bc5251', null, null, null),
('05a01816-e4b4-4b52-adc9-deeb6d7d42a4', 10010,  '720fce28-3c62-4ca9-ac28-10012bc07663', 'a4438fb8-6754-4662-a75b-b256fdce0533', 'b43215ed-ec9d-42cb-b274-a04b1b0b2f51', '2022-05-05', 'PASS');
