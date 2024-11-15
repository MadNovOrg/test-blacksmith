INSERT INTO course_audit (course_id, authorized_by, payload, type, xero_invoice_number)
SELECT id, NULL, '{}'::jsonb, 'COMPLETED', NULL
FROM course
WHERE course_status = 'COMPLETED';