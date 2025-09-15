INSERT INTO public.profile_trainer_role_type (profile_id, trainer_role_type_id) VALUES
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', (SELECT id FROM public.trainer_role_type WHERE name = 'assistant')),
('b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e', (SELECT id FROM public.trainer_role_type WHERE name = 'assistant'));