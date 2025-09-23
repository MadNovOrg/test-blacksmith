UPDATE public.course
SET course_status = 'CONFIRM_MODULES'
WHERE course_status IN 
    (
        'TRAINER_PENDING', 
        'TRAINER_UNAVAILABLE',
        'CANCELLED',
        'DECLINED',
        'GRADE_MISSING',
        'EVALUATION_MISSING',
        'COMPLETED',
        'APPROVAL_PENDING'
    );

DELETE FROM public.course_status
WHERE name IN (
    'TRAINER_PENDING', 
    'TRAINER_UNAVAILABLE',
    'CANCELLED', 
    'DECLINED',
    'GRADE_MISSING',
    'EVALUATION_MISSING',
    'COMPLETED',
    'APPROVAL_PENDING'
);
