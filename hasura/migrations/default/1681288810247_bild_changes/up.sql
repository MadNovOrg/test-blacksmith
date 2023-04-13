CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."accreditors" ("name" text NOT NULL, PRIMARY KEY ("name"));
alter table "public"."accreditors" add constraint "accreditors_name_key" unique ("name");

INSERT INTO "public"."accreditors"("name") VALUES (E'ICM');
INSERT INTO "public"."accreditors"("name") VALUES (E'BILD');
INSERT INTO "public"."accreditors"("name") VALUES (E'RSE');

alter table "public"."course" add column "accredited_by" text not null default 'ICM';
alter table "public"."course"
  add constraint "course_accredited_by_fkey"
  foreign key ("accredited_by")
  references "public"."accreditors"
  ("name") on update cascade on delete restrict;

CREATE TABLE "public"."course_bild_strategy" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_id" integer NOT NULL, "strategy_name" text NOT NULL, PRIMARY KEY ("id") );

CREATE TABLE "public"."bild_strategy" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "modules" jsonb NOT NULL, "short_name" text NOT NULL, duration integer, PRIMARY KEY ("id"), UNIQUE ("name") );

CREATE TABLE "public"."course_bild_module" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_id" integer NOT NULL, "modules" jsonb NOT NULL, PRIMARY KEY ("id") );

alter table "public"."course_bild_module"
  add constraint "course_bild_module_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;

alter table "public"."course_bild_strategy"
  add constraint "course_bild_strategy_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;

alter table "public"."course_bild_strategy"
  add constraint "course_bild_strategy_strategy_name_fkey"
  foreign key ("strategy_name")
  references "public"."bild_strategy"
  ("name") on update cascade on delete cascade;

  delete from "public"."course_level"
  where name in ('BILD_ACT', 'BILD_ACT_TRAINER');

  insert into "public"."course_level"(name)
  values ('BILD_REGULAR'), ('BILD_INTERMEDIATE_TRAINER'), ('BILD_ADVANCED_TRAINER');

insert into "public"."bild_strategy"(name, short_name, modules, duration)
values ('PRIMARY', 'P', '{
  "modules": [
    {"name": "Values excercise"},
    {"name": "Legal framework"},
    {"name": "Policies Practices & procedure"},
    {"name": "Recording and Reporting"},
    {"name": "6 Core Strategies"},
    {"name": "Circles of danger"},
    {"name": "Personal space  and body language"},
    {"name": "Feeling associated with Social Space, Personal Space & Intimate Space"},
    {"name": "Calm stance"},
    {"name": "Calming scripts"},
    {"name": "Mission Statement"},
    {"name": "Rights & Responsibilies"},
    {"name": "Handling plans"},
    {"name": "Scripts"},
    {"name": "Post Incident Learning and Support"},
    {"name": "Quiz"}
  ]
}'::jsonb, 6 * 60),
('SECONDARY', 'S', '{
  "modules": [
    {"name": "Six stages of crisis"},
    {"name": "Conflict Spiral"},
    {"name": "Fizzy pop challenge"},
    {"name": "Behaviours that challenge"},
    {"name": "De-escalation scenario"}
  ],
  "groups": [
    {"name": "Elevated Risks Module", "modules": [
      {"name": "Seclusion"},
      {"name": "Rapid tranquilisation"},
      {"name": "Chemical restraint"},
      {"name": "Mechanical restraint"},
      {"name": "Clinical holding"},
      {"name": "Physical restraint"},
      {"name": "Psychological Restraint"}
    ]}
  ]
}'::jsonb, 3 * 60),
('NON_RESTRICTIVE_TERTIARY', 'T', '{
  "groups": [
    {
      "name": "Arm responses",
      "duration": 30,
      "modules": [
        { "name": "Side step in" },
        { "name": "Drop elbow" },
        { "name": "Pump" },
        { "name": "Conductor" },
        { "name": "Cross over" },
        { "name": "Body Disengagements" }
      ]
    },
    {
      "name": "Neck Disengagement Module",
      "duration": 30,
      "modules": [
        { "name": "Steering wheel" },
        { "name": "Fix & stabilise" },
        { "name": "Windmill" },
        { "name": "Snake" },
        { "name": "Elbow Swing" },
        { "name": "Neck Brace" },
        { "name": "Bar & brace - behind" },
        { "name": "Elbow guide out of headlock" }
      ]
    },
    {
      "name": "Prompts and Guids",
      "duration": 20,
      "modules": [
        { "name": "Show and go" },
        { "name": "Caring C guide" },
        { "name": "Turn gather guide" },
        { "name": "Steering away" },
        { "name": "Arm waltz" },
        { "name": "Seperation" },
        { "name": "Punches & kicks" },
        { "name": "Half shield" },
        { "name": "Arm waltz" },
        { "name": "Turn gather guide" }
      ]
    },
    {
      "name": "Clothing Responses",
      "duration": 20,
      "modules": [
        { "name": "Closed fist hold" },
        { "name": "Tube grip" },
        { "name": "Close to the neck" },
        { "name": "From behind" }
      ]
    },
    {
      "name": "Hair Responses",
      "duration": 20,
      "modules": [
        { "name": "One handed grab" },
        { "name": "Two handed grab" },
        { "name": "Oyster" },
        { "name": "Knuckle roll" },
        { "name": "Knuckle slide" }
      ]
    },
    {
      "name": "Bite Responses",
      "duration": 20,
      "modules": [
        { "name": "Bite responses" },
        { "name": "Eye bulge" },
        { "name": "Distraction" },
        { "name": "Jaw manual manipulation" }
      ]
    }
  ]
}'::jsonb, null),
('RESTRICTIVE_TERTIARY_INTERMEDIATE', 'I', '{
  "groups": [
    {
      "name": "Small Child and One Person Holds Module",
      "modules": [
        { "name": "Moving in hold", "duration": 15 },
        { "name": "Sitting in hold", "duration": 15 },
        { "name": "Small person hold to chairs", "duration": 15, "mandatory": true },
        { "name": "Chairs/beanbags to hold", "duration": 15 },
        { "name": "Change of face in seated position", "duration": 15 },
        { "name": "Sitting to floor", "duration": 15 },
        { "name": "Help along side", "duration": 15 },
        { "name": "Response to dead weight", "duration": 15 },
        { "name": "Single person double elbow + support", "duration": 15 }
      ]
    },
    {
      "name": "Standing Graded Holds",
      "modules": [
        { "name": "Friendly", "duration": 30 },
        { "name": "Single elbow", "duration": 30 },
        { "name": "Figure of four", "duration": 30 },
        { "name": "Double elbow", "duration": 30 },
        { "name": "Response to spitting", "duration": 30 },
        { "name": "Response to dead weight", "duration": 30, "mandatory": true }
      ]
    },
    {
      "name": "Seated Holds Module",
      "modules": [
        { "name": "Standing Graded Holds to Seats", "duration": 30, "mandatory": true },
        { "name": "Small Person Holds to Seats / Been Bag", "duration": 30, "mandatory": true },
        { "name": "Moving to seated position", "duration": 30 },
        { "name": "Foot wedge", "duration": 30 },
        { "name": "Support with legs", "duration": 30 },
        { "name": "Change of face in seats", "duration": 30 },
        { "name": "Alternative change of face in seated", "duration": 30 },
        { "name": "Small child escorts", "duration": 30 }
      ]
    }
  ]
}'::jsonb, null),
('RESTRICTIVE_TERTIARY_ADVANCED', 'A', '{
  "groups": [
    {
      "name": "",
      "duration": 180,
      "modules": [
        { "name": "Sheild" },
        { "name": "Sitting cradle sheild" },
        { "name": "Sheild to FGR" },
        { "name": "Front Ground recovery" }
      ]
    },
    {
      "name": "",
      "duration": 180,
      "modules": [
        { "name": "Single Elbow to FGR" },
        { "name": "Front Ground recovery" }
      ]
    },
    {
      "name": "",
      "modules": [
        { "name": "Back ground recovery", "duration": 180 },
        { "name": "Hip Chair Emergency response", "duration": 45 },
        { "name": "Dead weight to standing", "duration": 15 },
        { "name": "Ground fights", "duration": 30 },
        { "name": "Ground assaults", "duration": 30 },
        { "name": "Response to everyday objects used as weapons", "duration": 360 }
      ]
    }
  ]
}'::jsonb, null)
