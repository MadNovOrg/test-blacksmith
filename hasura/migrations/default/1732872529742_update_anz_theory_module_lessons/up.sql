WITH filtered_lessons AS (
    SELECT 
        mv2.id AS module_id,
        jsonb_build_object(
            'items',
            jsonb_agg(DISTINCT item)
        ) AS updated_lessons
    FROM 
        module_v2 mv2
    JOIN 
        module_setting ms ON ms.module_name = mv2.name
    CROSS JOIN LATERAL 
        jsonb_array_elements(mv2.lessons->'items') AS item
    WHERE 
        ms.module_name LIKE '%Theory%'
        AND ms.shard = 'ANZ'
        AND item->>'name' != 'Behaviours of Communication'
    GROUP BY 
        mv2.id
)
UPDATE 
    module_v2
SET 
    lessons = filtered_lessons.updated_lessons
FROM 
    filtered_lessons
WHERE 
    module_v2.id = filtered_lessons.module_id;
