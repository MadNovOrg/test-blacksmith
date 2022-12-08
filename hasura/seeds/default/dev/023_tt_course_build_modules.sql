INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants) VALUES
    (10031, 'Positive Behaviour Training: Level One', 'INDIRECT', 'F2F', 'LEVEL_1', false, false, 'CONFIRM_MODULES', false, 5, 10);

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
    (date(now()) + time '09:00' + interval '4 month', date(now()) + time '17:00' + interval '4 month', 10031, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
    ('dccd780a-9745-4972-a43e-95ec3ef361df', 10031, 'LEADER', 'ACCEPTED');

SELECT setval('course_id_seq', 10031);
