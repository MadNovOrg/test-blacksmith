UPDATE module_v2
SET lessons = '{"items":[{"name":"Moving in hold"},{"name":"Sitting in hold"},{"name":"Chairs/beanbags to hold"},{"name":"Change of face in seated position"},{"name":"Sitting to floor"},{"name":"Help along side"},{"name":"Response to dead weight"},{"name":"Single person double elbow + support"},{"name":"Show and go"},{"name":"Caring C guide"},{"name":"Turn gather guide"},{"name":"Help hug"},{"name":"Small child escorts"}]}'::jsonb
WHERE name = 'Small Child and One Person Holds';
