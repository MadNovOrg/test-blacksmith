INSERT INTO public.course (id, description, name, course_type, course_delivery_type, course_level, organization_id,
                           reaccreditation, go1_integration, course_status, grading_confirmed)
VALUES (10012, '-', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1',
        'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'SCHEDULED', false);
SELECT setval('course_id_seq', 10013);

INSERT INTO public.course_schedule (start, "end", course_id, venue_id)
VALUES (date(now() + interval '1 month') + time '09:00', date(now() + interval '1 month') + time '17:00', 10012,
        'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_participant (course_id, profile_id)
VALUES (10012, '6b72504a-6447-4b30-9909-e8e6fc1d300f'),
       (10012, 'd394a9ff-7517-4e35-91aa-466f9d4c1b77'),
       (10012, 'fb523ef0-7fd1-42b2-b078-dce29a1713fe'),
       (10012, 'a39bb4b3-a07a-4610-8da1-b0ce885cc263');

INSERT INTO public.course_module (module_id, course_id)
SELECT module.id as module_id, 10012 as course_id
FROM public.module module
         JOIN public.module_group gr ON module.module_group_id = gr.id
WHERE module.course_level = 'LEVEL_1' AND gr.mandatory = TRUE;

INSERT INTO public.course_trainer (course_id, profile_id, type, status)
VALUES (10012, 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', 'LEADER', 'ACCEPTED');
