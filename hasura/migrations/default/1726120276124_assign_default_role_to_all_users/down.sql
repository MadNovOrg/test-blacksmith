WITH individual_role AS (
    SELECT id AS role_id 
    FROM role 
    WHERE name = 'user'
),
single_role_user_profiles AS (
    SELECT pr.profile_id
    FROM profile_role pr
    JOIN individual_role ir ON pr.role_id = ir.role_id
    GROUP BY pr.profile_id
    HAVING COUNT(pr.role_id) = 1
)
DELETE FROM profile_role
USING single_role_user_profiles sup, individual_role ir
WHERE profile_role.profile_id = sup.profile_id
  AND profile_role.role_id = ir.role_id;
