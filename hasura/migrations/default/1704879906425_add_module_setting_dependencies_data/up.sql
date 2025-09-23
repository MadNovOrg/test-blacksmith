INSERT INTO module_setting_dependency(module_setting_id, module_setting_dependency_id) VALUES 
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Bite Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Clothing Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Hair Responses'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Neck Disengagement'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Personal Safety'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Prompts and Guides'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Separations'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
),
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Small Child and One Person Holds'
  ),
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Physical Warm Up'
  )
);