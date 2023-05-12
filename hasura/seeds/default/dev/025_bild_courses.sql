
INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants, accredited_by) VALUES
    (10032, 'BILD Certified Course: PS', 'INDIRECT', 'F2F', 'BILD_REGULAR', false, false, 'CONFIRM_MODULES', false, 2, 10, 'BILD'),
    (10033, 'BILD Certified Course: PSTI', 'CLOSED', 'F2F', 'BILD_INTERMEDIATE_TRAINER', false, false, 'GRADE_MISSING', false, 2, 10, 'BILD'),
    (10034, 'BILD Certified Course: A', 'OPEN', 'F2F', 'BILD_ADVANCED_TRAINER', false, false, 'SCHEDULED', false, 2, 10, 'BILD');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
    (date(now()) + time '09:00' + interval '4 month', date(now()) + time '17:00' + interval '4 month', 10032, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
    (date(now()) + time '09:00' - interval '2 days', date(now()) + time '17:00' - interval '2 days', 10033, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
    (date(now()) + time '09:00' + interval '5 days', date(now()) + time '17:00' + interval '5 days', 10034, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
    ('13a223a8-2184-42f1-ba37-b49e115e59a2', 10032, 'LEADER', 'ACCEPTED'),
    ('13a223a8-2184-42f1-ba37-b49e115e59a2', 10033, 'LEADER', 'ACCEPTED'),
    ('13a223a8-2184-42f1-ba37-b49e115e59a2', 10034, 'LEADER', 'ACCEPTED');

INSERT INTO public.course_bild_strategy (course_id, strategy_name)
VALUES (10032, 'PRIMARY'),
       (10032, 'SECONDARY'),
       (10033, 'PRIMARY'),
       (10033, 'SECONDARY'),
       (10033, 'NON_RESTRICTIVE_TERTIARY'),
       (10033, 'RESTRICTIVE_TERTIARY_INTERMEDIATE'),
       (10034, 'RESTRICTIVE_TERTIARY_ADVANCED');

INSERT INTO public.course_invites (id, email, status, course_id) VALUES
('622a4749-0a96-43e3-94ba-80c15dfc64fe', 'user1@teamteach.testinator.com', 'ACCEPTED', 10033),
('479179f7-da48-432a-9c48-45297bb9a491', 'user2@teamteach.testinator.com', 'ACCEPTED', 10033);

INSERT INTO public.course_participant (course_id, profile_id, invite_id) VALUES
(10033, '6b72504a-6447-4b30-9909-e8e6fc1d300f', '622a4749-0a96-43e3-94ba-80c15dfc64fe'),
(10033, 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', '479179f7-da48-432a-9c48-45297bb9a491');

INSERT INTO public.course_bild_module (course_id, modules)
VALUES (10034, '{
   "RESTRICTIVE_TERTIARY_ADVANCED":{
      "groups":[
         {
            "name":"",
            "duration":180,
            "modules":[
               {
                  "name":"Sheild"
               },
               {
                  "name":"Sitting cradle sheild"
               },
               {
                  "name":"Sheild to FGR"
               },
               {
                  "name":"Front Ground recovery"
               }
            ]
         }
      ],
      "modules":[
         {
            "name":"Single Elbow to FGR",
            "duration":30
         },
         {
            "name":"Front Ground recovery",
            "duration":120
         },
         {
            "name":"Back ground recovery",
            "duration":180
         },
         {
            "name":"Hip Chair Emergency response",
            "duration":45
         },
         {
            "name":"Dead weight to standing",
            "duration":15
         },
         {
            "name":"Ground fights",
            "duration":30
         },
         {
            "name":"Ground assaults",
            "duration":30
         },
         {
            "name":"Response to everyday objects used as weapons",
            "duration":360
         }
      ]
   }
}'::jsonb),
(10033, '{
   "PRIMARY":{
      "modules":[
         {
            "name":"Values excercise"
         },
         {
            "name":"Legal framework"
         },
         {
            "name":"Policies Practices & procedure"
         },
         {
            "name":"Recording and Reporting"
         },
         {
            "name":"6 Core Strategies"
         },
         {
            "name":"Circles of danger"
         },
         {
            "name":"Personal space  and body language"
         },
         {
            "name":"Feeling associated with Social Space, Personal Space & Intimate Space"
         },
         {
            "name":"Calm stance"
         },
         {
            "name":"Calming scripts"
         },
         {
            "name":"Mission Statement"
         },
         {
            "name":"Rights & Responsibilies"
         },
         {
            "name":"Handling plans"
         },
         {
            "name":"Scripts"
         },
         {
            "name":"Post Incident Learning and Support"
         },
         {
            "name":"Quiz"
         }
      ]
   },
   "SECONDARY":{
      "modules":[
         {
            "name":"Six stages of crisis"
         }
      ]
   },
   "NON_RESTRICTIVE_TERTIARY":{
      "groups":[
         {
            "name":"Arm responses",
            "duration":30,
            "modules":[
               {
                  "name":"Side step in"
               },
               {
                  "name":"Drop elbow"
               },
               {
                  "name":"Pump"
               },
               {
                  "name":"Conductor"
               },
               {
                  "name":"Cross over"
               },
               {
                  "name":"Body Disengagements"
               }
            ]
         }
      ]
   },
   "RESTRICTIVE_TERTIARY_INTERMEDIATE":{
      "groups":[
         {
            "name":"Small Child and One Person Holds Module",
            "modules":[
               {
                  "name":"Moving in hold",
                  "duration":15
               },
               {
                  "name":"Sitting in hold",
                  "duration":15
               },
               {
                  "name":"Small person hold to chairs",
                  "duration":15,
                  "mandatory":true
               },
               {
                  "name":"Chairs/beanbags to hold",
                  "duration":15
               },
               {
                  "name":"Change of face in seated position",
                  "duration":15
               }
            ]
         }
      ]
   }
}'::jsonb);

SELECT setval('course_id_seq', 10034);
