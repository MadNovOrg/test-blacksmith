WITH updated_lessons AS (
    SELECT 
        mv2.id AS module_id,
        jsonb_set(
            mv2.lessons, 
            '{items}', 
            jsonb_agg(DISTINCT item) || jsonb_build_object('name', 'Behaviours of Communication')
        ) AS restored_lessons
    FROM 
        module_v2 mv2
    JOIN 
        module_setting ms ON ms.module_name = mv2.name
    CROSS JOIN LATERAL 
        jsonb_array_elements(mv2.lessons->'items') AS item
    WHERE 
        ms.module_name LIKE '%Theory%'
        AND ms.shard = 'ANZ'
        AND NOT (item->>'name' = 'Behaviours of Communication')
    GROUP BY 
        mv2.id
)
UPDATE 
    module_v2
SET 
    lessons = updated_lessons.restored_lessons
FROM 
    updated_lessons
WHERE 
    module_v2.id = updated_lessons.module_id;
