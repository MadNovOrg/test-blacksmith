UPDATE public.organization
SET go1_licenses = 18, reserved_go1_licenses = 6
WHERE id = 'c43b2ba0-8630-43e5-9558-f59ee9a224f0';

INSERT INTO
    public.go1_licenses_history(org_id, event, change, balance, reserved_balance, payload, captured_at)
VALUES
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSES_ADDED', 20, 20, 0, '{"invoiceId": "INV.002884", "invokedBy": "Benjamin Admin", "invokedById": "22015a3e-8907-4333-8811-85f782265a63"}'::jsonb, now() - interval '7 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSES_REMOVED', -2, 18, 0, '{"invoiceId": "INV.002884", "invokedBy": "Benjamin Admin", "invokedById": "22015a3e-8907-4333-8811-85f782265a63"}'::jsonb, now() - interval '6 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSE_REVOKED', 2, 20, 0, '{"invokedBy": "Benjamin Admin", "invokedById": "22015a3e-8907-4333-8811-85f782265a63"}'::jsonb, now() - interval '5 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSES_RESERVED', -12, 8, 12, '{"invokedBy": "Benjamin Admin", "invokedById": "22015a3e-8907-4333-8811-85f782265a63", "courseId": "10010", "courseCode": "CL-ADV-T-10010"}'::jsonb, now() - interval '5 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSE_ISSUED', -1, 13, 6, '{"courseId": "10010", "courseCode": "CL-ADV-T-10010"}'::jsonb, now() - interval '3 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSES_RELEASED', 5, 13, 7, '{"courseId": "10010", "courseCode": "CL-ADV-T-10010"}'::jsonb, now() - interval '4 days'),
    ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LICENSES_PURCHASED', 5, 18, 6,'{"invoiceId": "INV.002884"}'::jsonb, now() - interval '2 days');

INSERT INTO public.go1_licenses(org_id, profile_id, expire_date)
VALUES ('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', now() + interval '12 months')
