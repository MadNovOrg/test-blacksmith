--45045398-f757-4ece-85c0-bdf2d95d7cee, 913777a7-07fd-46d6-8ad8-d7498f630aea, bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6

UPDATE course SET max_participants = 25 WHERE id = 10000;

-- insert participants to profile table
INSERT INTO profile (id, _given_name, _family_name, _email, _phone) VALUES
('fdedead5-1218-4332-8199-8b2bdce414a7', 'John', 'Doe', 'john.doe@teamteach.testinator.com', '+44 55 5555 5555'),
('11935252-570f-42ef-a141-5cdf8f78270d', 'Apolonija', 'Deo', 'apolonija.deo@teamteach.testinator.com', '+44 55 5555 5555'),
('41e9fa1d-0712-43cd-8571-bbf219ab016b', 'Zaman', 'Wilt', 'zaman.wilt@teamteach.testinator.com', '+44 55 5555 5555'),
('127ac7f5-9c91-4b1c-8c13-13e226d60f78', 'Balbus', 'Linde', 'balbus.linde@teamteach.testinator.com', '+44 55 5555 5555'),
('47b5b128-0a47-4094-86f6-87005eb12d71', 'Linwood', 'Darien', 'linwood.darien@teamteach.testinator.com', '+44 55 5555 5555'),
('2e06729d-7436-427a-a5cf-ff7c9496b85c', 'Cheyanne', 'Kathryn', 'cheyanne.kathryn@teamteach.testinator.com', '+44 55 5555 5555'),
('b5702c04-35a6-4c55-b24a-592dc0a05142', 'Cassandra', 'Jess', 'cassandra.jess@teamteach.testinator.com', '+44 55 5555 5555'),
('43ead544-671c-46fb-ba8f-b5858c83a2d8', 'Jorie', 'Nolene', 'jorie.nolene@teamteach.testinator.com', '+44 55 5555 5555'),
('ae8f617c-2411-42aa-9501-f2f08b16a76e', 'Lynda' ,'Claud', 'lynda.claud@teamteach.testinator.com', '+44 55 5555 5555'),
('6896b053-0d36-45b4-889c-9472d846c4a1', 'Maxene', 'Netta', 'maxene.netta@teamteach.testinator.com', '+44 55 5555 5555'),
('fbe6eb48-ad58-40f9-9388-07e743240ce3', 'Lilac', 'Reuben', 'lilac.reuben@teamteach.testinator.com', '+44 55 5555 5555'),
('d1b97054-357e-4a53-9a43-4acf8353a465', 'Audrea', 'Nona', 'audrea.nona@teamteach.testinator.com', '+44 55 5555 5555'),
('bdc08f2a-6a23-4a53-9587-65f32d16c41e', 'Henrietta', 'Dewey', 'henrietta.dewey@teamteach.testinator.com', '+44 55 5555 5555'),
('bb3e469d-044b-416a-9831-282e6a2c5af7', 'Lotus', 'Mimi', 'lotus.mimi@teamteach.testinator.com', '+44 55 5555 5555'),
('f858c22c-3996-4137-a205-099e4521491f', 'Deacon', 'Hope', 'deacon.hope@teamteach.testinator.com', '+44 55 5555 5555'),
('ab528bc4-0d66-417f-8a34-eed6b949ea27', 'Coby', 'Bert', 'coby.bert@teamteach.testinator.com', '+44 55 5555 5555'),
('1054214f-1f5b-4d94-a381-ab6fba404f41', 'Khloe', 'Izzy', 'khloe.izzy@teamteach.testinator.com', '+44 55 5555 5555'),
('5a7f3010-cd40-454a-88d9-c93935c039ec', 'Bryan', 'Chuckie', 'bryan.chuckie@teamteach.testinator.com', '+44 55 5555 5555'),
('5ef68528-fb02-4462-8261-689930075d15', 'Merge 1', 'User', 'merge1.user@teamteach.testinator.com', '+44 55 5555 5555'),
('8e80fda2-ed5a-4284-b95a-cbec399303f5', 'Merge 2', 'User', 'merge2.user@teamteach.testinator.com', '+44 55 5555 5555'),
('720fce28-3c62-4ca9-ac28-10012bc07663', 'Merge 3', 'User', 'merge3.user@teamteach.testinator.com', '+44 55 5555 5555'),
('e19d8f15-f7e6-477f-8080-dcb3ca20ba1b', 'Merge 4', 'User', 'merge4.user@teamteach.testinator.com', '+44 55 5555 5555'),
('3df19e95-4410-49a5-bdb1-fc56e1548317', 'Merge 5', 'User', 'merge5.user@teamteach.testinator.com', '+44 55 5555 5555'),
('5ca8978e-bac6-436c-8cee-4ad107180f45', 'Merge 6', 'User', 'merge6.user@teamteach.testinator.com', '+44 55 5555 5555'),
('2f848f4d-436f-45db-95e4-77daa2d25e37', 'Merge 7', 'User', 'merge7.user@teamteach.testinator.com', '+44 55 5555 5555'),
('d1a9f1bb-b927-4498-9649-42bd2965ca5b', 'Merge 8', 'User', 'merge8.user@teamteach.testinator.com', '+44 55 5555 5555');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('061c2cbb-81ba-4c8f-8ae2-a5bda2092df4', '11935252-570f-42ef-a141-5cdf8f78270d', 'cognito'),
('b183218d-4cd0-4c11-8002-c605fdbe091f', 'fdedead5-1218-4332-8199-8b2bdce414a7', 'cognito'),
('3a20379e-be3b-481c-ae7f-0aa29922f2b6', '41e9fa1d-0712-43cd-8571-bbf219ab016b', 'cognito'),
('04f8abad-c745-42ae-b715-946db40273e0', '127ac7f5-9c91-4b1c-8c13-13e226d60f78', 'cognito'),
('6e5f304f-a1b4-4a6e-89bc-35b042678416', '47b5b128-0a47-4094-86f6-87005eb12d71', 'cognito'),
('4a814245-72b4-4f97-affd-4d529487f1eb', '2e06729d-7436-427a-a5cf-ff7c9496b85c', 'cognito'),
('feec91f6-0221-47e5-a329-891343f5e63b', 'b5702c04-35a6-4c55-b24a-592dc0a05142', 'cognito'),
('6595c566-10af-4083-a458-3d5cf22e6a6c', '43ead544-671c-46fb-ba8f-b5858c83a2d8', 'cognito'),
('338d64cd-8d16-4c38-84ea-3f281e3e7364', 'ae8f617c-2411-42aa-9501-f2f08b16a76e', 'cognito'),
('a86c0100-b315-46f1-85d6-f972694f8c6c', '6896b053-0d36-45b4-889c-9472d846c4a1', 'cognito'),
('35a16c4d-c303-45aa-a55b-d275fb43c4ec', 'fbe6eb48-ad58-40f9-9388-07e743240ce3', 'cognito'),
('b5baab35-d348-4416-99b7-17e40cf015f6', 'd1b97054-357e-4a53-9a43-4acf8353a465', 'cognito'),
('9611f48e-66ab-427c-bf8b-06f869fe9e9f', 'bdc08f2a-6a23-4a53-9587-65f32d16c41e', 'cognito'),
('df753c8d-3501-42f4-9688-0f58adf3db14', 'bb3e469d-044b-416a-9831-282e6a2c5af7', 'cognito'),
('6d12ea23-423a-4fe5-a343-38153fb7db68', 'f858c22c-3996-4137-a205-099e4521491f', 'cognito'),
('146987aa-2607-44eb-8f16-fef57c60c80e', 'ab528bc4-0d66-417f-8a34-eed6b949ea27', 'cognito'),
('98f6551e-6207-4d32-8719-fea2242ad85b', '1054214f-1f5b-4d94-a381-ab6fba404f41', 'cognito'),
('136bae8d-005e-4031-840a-74ca69fe54ac', '5a7f3010-cd40-454a-88d9-c93935c039ec', 'cognito'),
('a0b22ba8-83cb-4522-acef-fdd21c54f7af', '5ef68528-fb02-4462-8261-689930075d15', 'cognito'), -- merge1.user@teamteach.testinator.com
('1a0c58a1-f6f0-4409-9390-286c4f13d8be', '8e80fda2-ed5a-4284-b95a-cbec399303f5', 'cognito'), -- merge2.user@teamteach.testinator.com
('4d6f25a6-60da-4179-b0e6-ad186b18e4f4', '720fce28-3c62-4ca9-ac28-10012bc07663', 'cognito'), -- merge3.user@teamteach.testinator.com
('5d06c636-8019-4c26-9083-42277b074ee8', 'e19d8f15-f7e6-477f-8080-dcb3ca20ba1b', 'cognito'), -- merge4.user@teamteach.testinator.com
('31f336d3-d890-40a3-999d-f5969cc35234', '3df19e95-4410-49a5-bdb1-fc56e1548317', 'cognito'), -- merge5.user@teamteach.testinator.com
('dff92ac1-071e-4aa3-98cc-f621fb80c73b', '5ca8978e-bac6-436c-8cee-4ad107180f45', 'cognito'), -- merge6.user@teamteach.testinator.com
('2a87bbc4-b2da-42c9-b721-355511189057', '2f848f4d-436f-45db-95e4-77daa2d25e37', 'cognito'), -- merge7.user@teamteach.testinator.com
('77e4959c-d73e-41a1-ab58-4f691044437d', 'd1a9f1bb-b927-4498-9649-42bd2965ca5b', 'cognito'); -- merge8.user@teamteach.testinator.com

-- Adding participant role to all participants
INSERT INTO profile_role (profile_id, role_id) VALUES
('fdedead5-1218-4332-8199-8b2bdce414a7', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('11935252-570f-42ef-a141-5cdf8f78270d', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('41e9fa1d-0712-43cd-8571-bbf219ab016b', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('127ac7f5-9c91-4b1c-8c13-13e226d60f78', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('47b5b128-0a47-4094-86f6-87005eb12d71', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('2e06729d-7436-427a-a5cf-ff7c9496b85c', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('b5702c04-35a6-4c55-b24a-592dc0a05142', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('43ead544-671c-46fb-ba8f-b5858c83a2d8', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('ae8f617c-2411-42aa-9501-f2f08b16a76e', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('6896b053-0d36-45b4-889c-9472d846c4a1', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('fbe6eb48-ad58-40f9-9388-07e743240ce3', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('d1b97054-357e-4a53-9a43-4acf8353a465', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('bdc08f2a-6a23-4a53-9587-65f32d16c41e', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('bb3e469d-044b-416a-9831-282e6a2c5af7', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('f858c22c-3996-4137-a205-099e4521491f', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('ab528bc4-0d66-417f-8a34-eed6b949ea27', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('1054214f-1f5b-4d94-a381-ab6fba404f41', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('5a7f3010-cd40-454a-88d9-c93935c039ec', '151f0884-a8c8-48e2-a619-c4434864ea67'),
('5ef68528-fb02-4462-8261-689930075d15', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge1.user@teamteach.testinator.com
('8e80fda2-ed5a-4284-b95a-cbec399303f5', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge2.user@teamteach.testinator.com
('720fce28-3c62-4ca9-ac28-10012bc07663', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge3.user@teamteach.testinator.com
('e19d8f15-f7e6-477f-8080-dcb3ca20ba1b', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge4.user@teamteach.testinator.com
('3df19e95-4410-49a5-bdb1-fc56e1548317', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge5.user@teamteach.testinator.com
('5ca8978e-bac6-436c-8cee-4ad107180f45', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge6.user@teamteach.testinator.com
('2f848f4d-436f-45db-95e4-77daa2d25e37', '151f0884-a8c8-48e2-a619-c4434864ea67'), -- merge7.user@teamteach.testinator.com
('d1a9f1bb-b927-4498-9649-42bd2965ca5b', '151f0884-a8c8-48e2-a619-c4434864ea67'); -- merge8.user@teamteach.testinator.com

INSERT INTO organization (id, name, original_record) VALUES
('46c34024-ea2f-4146-962d-c3e0fc3b923b', 'Example organization', '{}');

--add all participants to organization
INSERT INTO organization_member (profile_id, organization_id) VALUES
('fdedead5-1218-4332-8199-8b2bdce414a7', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('11935252-570f-42ef-a141-5cdf8f78270d', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('41e9fa1d-0712-43cd-8571-bbf219ab016b', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('127ac7f5-9c91-4b1c-8c13-13e226d60f78', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('47b5b128-0a47-4094-86f6-87005eb12d71', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('2e06729d-7436-427a-a5cf-ff7c9496b85c', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('b5702c04-35a6-4c55-b24a-592dc0a05142', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('43ead544-671c-46fb-ba8f-b5858c83a2d8', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('ae8f617c-2411-42aa-9501-f2f08b16a76e', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('6896b053-0d36-45b4-889c-9472d846c4a1', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('fbe6eb48-ad58-40f9-9388-07e743240ce3', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('d1b97054-357e-4a53-9a43-4acf8353a465', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('bdc08f2a-6a23-4a53-9587-65f32d16c41e', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('bb3e469d-044b-416a-9831-282e6a2c5af7', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('f858c22c-3996-4137-a205-099e4521491f', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('ab528bc4-0d66-417f-8a34-eed6b949ea27', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('1054214f-1f5b-4d94-a381-ab6fba404f41', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('5a7f3010-cd40-454a-88d9-c93935c039ec', '46c34024-ea2f-4146-962d-c3e0fc3b923b'),
('5ef68528-fb02-4462-8261-689930075d15', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- merge1.user@teamteach.testinator.com
('8e80fda2-ed5a-4284-b95a-cbec399303f5', '46c34024-ea2f-4146-962d-c3e0fc3b923b'); -- merge2.user@teamteach.testinator.com

INSERT INTO public.course_invites (id, email, status, course_id) VALUES
('d1d9a569-6f96-42ee-ac83-1ecb3f849001', 'john.doe@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849002', 'apolonija.deo@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849003', 'zaman.wilt@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849004', 'balbus.linde@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849005', 'linwood.darien@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849006', 'cheyanne.kathryn@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849007', 'cassandra.jess@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849008', 'jorie.nolene@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849009', 'lynda.claud@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849010', 'maxene.netta@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849011', 'lilac.reuben@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849012', 'audrea.nona@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849013', 'henrietta.dewey@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849014', 'lotus.mimi@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849015', 'deacon.hope@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849016', 'coby.bert@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849017', 'khloe.izzy@teamteach.testinator.com', 'ACCEPTED', 10000),
('d1d9a569-6f96-42ee-ac83-1ecb3f849018', 'bryan.chuckie@teamteach.testinator.com', 'ACCEPTED', 10000),
('8a138a65-36fe-449f-bc83-dc435ca9fb0f', 'stacey.liptak@teamteach.testinator.com', 'PENDING', 10000),
('cc025226-c93e-4fe7-9909-f754882ffe19', 'james.phenlan@teamteach.testinator.com', 'PENDING', 10000),
('b36d524e-577e-45c6-a652-09d981435218', 'charles.scanlon@teamteach.testinator.com', 'PENDING', 10000),
('e2f6c2c7-c19a-41f3-b405-e92ed5dd9305', 'timothy.murphy@teamteach.testinator.com', 'DECLINED', 10000),
('2c562361-efb2-4683-aab0-f2d3ebc86d3b', 'marquis.pappas@teamteach.testinator.com', 'DECLINED', 10000),
('5ef68528-fb02-4462-8261-689930075d15', 'merge1.user@teamteach.testinator.com', 'ACCEPTED', 10000),
('8e80fda2-ed5a-4284-b95a-cbec399303f5', 'merge2.user@teamteach.testinator.com', 'ACCEPTED', 10000),

('d1d9a569-6f96-42ee-ac83-1ecb3f849019', 'john.doe@teamteach.testinator.com', 'ACCEPTED', 10010),
('d1d9a569-6f96-42ee-ac83-1ecb3f849020', 'apolonija.deo@teamteach.testinator.com', 'ACCEPTED', 10010),
('d1d9a569-6f96-42ee-ac83-1ecb3f849021', 'zaman.wilt@teamteach.testinator.com', 'ACCEPTED', 10010),
('d1d9a569-6f96-42ee-ac83-1ecb3f849022', 'balbus.linde@teamteach.testinator.com', 'ACCEPTED', 10010),
('d1d9a569-6f96-42ee-ac83-1ecb3f849023', 'linwood.darien@teamteach.testinator.com', 'ACCEPTED', 10010);

INSERT INTO public.course_participant (registration_id, course_id, profile_id, invoice_id, invite_id, attended, hs_consent, grade) VALUES
('8aba9220-8e09-433b-ad83-51c53f2523c0', 10001, 'ab528bc4-0d66-417f-8a34-eed6b949ea27', '0b156d52-b6a1-4238-bab0-4b1e99a9dc88', 'd1d9a569-6f96-42ee-ac83-1ecb3f849016', true, false, NULL),
('8aba9220-8e09-433b-ad83-51c53f2523c0', 10001, '1054214f-1f5b-4d94-a381-ab6fba404f41', '0b156d52-b6a1-4238-bab0-4b1e99a9dc88', 'd1d9a569-6f96-42ee-ac83-1ecb3f849017', false, false, NULL),
('d44e5d0a-d4b2-41b1-826a-8672e5312736', 10001, '5a7f3010-cd40-454a-88d9-c93935c039ec', 'e2de96f8-7bee-428c-bc6d-f3603f84e9de', 'd1d9a569-6f96-42ee-ac83-1ecb3f849018', true, false, NULL),
('af9e4740-9e8e-4465-adab-4a5ebbb73e4b', 10004, '6896b053-0d36-45b4-889c-9472d846c4a1', '5e7c2158-92a8-4c70-a506-f3b205b4ccad', 'd1d9a569-6f96-42ee-ac83-1ecb3f849010', true, false, NULL),
('3c665955-9ae8-47bc-84b6-9c103fea3b06', 10004, 'fbe6eb48-ad58-40f9-9388-07e743240ce3', 'c90c93de-24a5-47cb-816d-d1a379543d86', 'd1d9a569-6f96-42ee-ac83-1ecb3f849011', true, false, NULL),
('5cedc5b2-d27f-43a2-84ed-d0b59df4efad', 10004, 'd1b97054-357e-4a53-9a43-4acf8353a465', 'ed3537bf-1338-4490-b1d4-ad4e4924ea74', 'd1d9a569-6f96-42ee-ac83-1ecb3f849012', true, false, NULL),
('fa8a138d-66ce-4fc8-b1dd-54f20fab46e9', 10004, 'bdc08f2a-6a23-4a53-9587-65f32d16c41e', '4b6d073c-b5f3-488a-a8e4-ce16e2fb9ac1', 'd1d9a569-6f96-42ee-ac83-1ecb3f849013', true, false, NULL),
('edb0661b-bede-4a09-9066-339b7a0fe78b', 10010, 'fdedead5-1218-4332-8199-8b2bdce414a7', '26e05f96-b687-4348-b6d8-1c863a8499f9', 'd1d9a569-6f96-42ee-ac83-1ecb3f849019', true, false, NULL),
('424d6da7-bb67-4353-88f7-640ddd6db6e3', 10010, '11935252-570f-42ef-a141-5cdf8f78270d', '949c2685-4a9f-4cbb-82f2-d5fdaa1565aa', 'd1d9a569-6f96-42ee-ac83-1ecb3f849020', true, false, NULL),
('9b7c7e36-666c-4a0f-a01f-bbbced0c0b82', 10010, '41e9fa1d-0712-43cd-8571-bbf219ab016b', '1813431c-fe22-4e49-b603-97ee02dc1df9', 'd1d9a569-6f96-42ee-ac83-1ecb3f849021', true, false, NULL),
('33ff3352-ac87-476c-bb6e-4fadc423abc8', 10010, '127ac7f5-9c91-4b1c-8c13-13e226d60f78', '47988253-2329-4674-b47c-bf861f2c2169', 'd1d9a569-6f96-42ee-ac83-1ecb3f849022', true, false, NULL),
('5ab9a7e6-1da8-412d-81a9-faf8c099c092', 10010, '47b5b128-0a47-4094-86f6-87005eb12d71', '2f0d984b-7942-41c6-ac5a-339805a77845', 'd1d9a569-6f96-42ee-ac83-1ecb3f849023', true, false, NULL),
('90e56c4d-14b4-4112-b452-0361090eabda', 10006, '2e06729d-7436-427a-a5cf-ff7c9496b85c', '3bb3603e-bf8d-40b4-b0a7-cabb101bccb9', 'd1d9a569-6f96-42ee-ac83-1ecb3f849006', true, false, 'PASS'),
('867f2221-9b1b-4afe-a662-d896da3f2398', 10006, 'b5702c04-35a6-4c55-b24a-592dc0a05142', '134e0572-30d0-4dc7-b026-18203f01e88b', 'd1d9a569-6f96-42ee-ac83-1ecb3f849007', true, false, 'PASS'),
('15408e55-79ef-41d0-915e-1c81513d3e39', 10006, '43ead544-671c-46fb-ba8f-b5858c83a2d8', '25478835-6d99-4d99-b0f7-3957fd8a7241', 'd1d9a569-6f96-42ee-ac83-1ecb3f849008', true, false, 'PASS'),
('15408e55-79ef-41d0-915e-1c81513d3e40', 10006, 'ae8f617c-2411-42aa-9501-f2f08b16a76e', '25478835-6d99-4d99-b0f7-3957fd8a7242', 'd1d9a569-6f96-42ee-ac83-1ecb3f849009', true, false, 'PASS'),
('af9e4740-9e8e-4465-adab-4a5ebbb73e4b', 10006, '6896b053-0d36-45b4-889c-9472d846c4a1', '5e7c2158-92a8-4c70-a506-f3b205b4ccad', 'd1d9a569-6f96-42ee-ac83-1ecb3f849010', true, false, 'PASS'),
('3c665955-9ae8-47bc-84b6-9c103fea3b05', 10006, 'fbe6eb48-ad58-40f9-9388-07e743240ce3', 'c90c93de-24a5-47cb-816d-d1a379543d86', 'd1d9a569-6f96-42ee-ac83-1ecb3f849011', true, false, 'PASS'),
('3c665955-9ae8-47bc-84b6-9c103fea3b07', 10006, '5ef68528-fb02-4462-8261-689930075d15', 'ed8bf937-41e0-4644-a13b-ed31f2ccb05b', '5ef68528-fb02-4462-8261-689930075d15', true, false, 'PASS'),
('3c665955-9ae8-47bc-84b6-9c103fea3b08', 10007, '8e80fda2-ed5a-4284-b95a-cbec399303f5', '99f985c2-9740-4208-9ba1-56db9c770423', '8e80fda2-ed5a-4284-b95a-cbec399303f5', true, false, 'PASS');
