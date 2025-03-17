
ALTER TABLE public.course  
DROP CONSTRAINT course_resource_packs_delivery_type_fkey;

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'course' 
        AND table_schema = 'public' 
        AND column_name = 'resource_packs_delivery_type'
    ) THEN
        ALTER TABLE public.course 
        DROP COLUMN resource_packs_delivery_type;
    END IF;
END $$;

DELETE FROM "public"."resource_packs_delivery_type" WHERE "name" = 'EXPRESS';

DELETE FROM "public"."resource_packs_delivery_type" WHERE "name" = 'STANDARD';

DROP TABLE "public"."resource_packs_delivery_type";
