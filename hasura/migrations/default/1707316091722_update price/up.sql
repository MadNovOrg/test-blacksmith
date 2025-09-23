UPDATE public.course_pricing_schedule
SET price_amount = '425'
WHERE course_pricing_id = (SELECT id FROM public.course_pricing WHERE level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER' AND reaccreditation = true limit 1);
