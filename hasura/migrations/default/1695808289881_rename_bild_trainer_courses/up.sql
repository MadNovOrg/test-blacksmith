UPDATE public.course
SET name = 'BILD Advanced Trainer Reaccreditation'
WHERE course_level = 'BILD_ADVANCED_TRAINER' AND reaccreditation = TRUE AND conversion = FALSE;

UPDATE public.course
SET name = 'BILD Advanced Trainer Conversion'
WHERE course_level = 'BILD_ADVANCED_TRAINER' AND reaccreditation = FALSE AND conversion = TRUE;

UPDATE public.course
SET name = 'BILD Advanced Trainer'
WHERE course_level = 'BILD_ADVANCED_TRAINER' AND reaccreditation = FALSE AND conversion = FALSE;

UPDATE public.course
SET name = 'BILD Intermediate Trainer Reaccreditation'
WHERE course_level = 'BILD_INTERMEDIATE_TRAINER' AND reaccreditation = TRUE AND conversion = FALSE;

UPDATE public.course
SET name = 'BILD Intermediate Trainer Conversion'
WHERE course_level = 'BILD_INTERMEDIATE_TRAINER' AND reaccreditation = FALSE AND conversion = TRUE;

UPDATE public.course
SET name = 'BILD Intermediate Trainer'
WHERE course_level = 'BILD_INTERMEDIATE_TRAINER' AND reaccreditation = FALSE AND conversion = FALSE;
