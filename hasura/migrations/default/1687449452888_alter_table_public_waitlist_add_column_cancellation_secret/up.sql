alter table
    "public"."waitlist"
add
    column "cancellation_secret" uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE;