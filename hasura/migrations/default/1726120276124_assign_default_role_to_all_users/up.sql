WITH individual_role AS (
    SELECT id AS role_id FROM role WHERE name = 'user'
)
INSERT INTO profile_role (profile_id, role_id)
SELECT p.id, ir.role_id
FROM profile p
CROSS JOIN individual_role ir
LEFT JOIN profile_role pr ON p.id = pr.profile_id AND pr.role_id = ir.role_id
WHERE pr.profile_id IS NULL;