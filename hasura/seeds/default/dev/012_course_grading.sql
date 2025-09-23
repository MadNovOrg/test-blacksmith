INSERT INTO public.course_participant_module (course_participant_id, module_id, completed)
SELECT participant.id as course_participant_id, module.id as module_id, TRUE as completed
FROM public.course_participant participant
JOIN public.course course ON participant.course_id = course.id
JOIN public.course_module cmodule ON cmodule.course_id = course.id
JOIN public.module module ON cmodule.module_id = module.id
WHERE course.id = 10006;