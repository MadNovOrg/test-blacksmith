INSERT INTO public.course (id, description, name, course_type, course_delivery_type, course_level, organization_id, reaccreditation)
VALUES ('45045398-f757-4ece-85c0-bdf2d95d7cee', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false), 
    ('913777a7-07fd-46d6-8ad8-d7498f630aea', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false),
    ('bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Advanced Modules', 'OPEN', 'F2F', 'ADVANCED', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false);

INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, '45045398-f757-4ece-85c0-bdf2d95d7cee', 'leader'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';
INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, '913777a7-07fd-46d6-8ad8-d7498f630aea', 'leader'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';
INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, 'bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6', 'leader'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';

INSERT INTO public.venue (id, name, address)
VALUES ('bd4e4af5-8822-485c-bf48-16fe0d50729b', 'Birchwood Academy', '{
  "city": "Kent"
}'::jsonb);

INSERT INTO public.course_schedule (name, type, start, "end", course_id, venue_id)
VALUES ('name', 'PHYSICAL', '2022-03-01', '2022-03-03', '45045398-f757-4ece-85c0-bdf2d95d7cee',
        'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
       ('name', 'PHYSICAL', '2022-03-01', '2022-03-03', '913777a7-07fd-46d6-8ad8-d7498f630aea',
        'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
       ('name', 'PHYSICAL', '2022-03-01', '2022-03-03', 'bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6',
        'bd4e4af5-8822-485c-bf48-16fe0d50729b');