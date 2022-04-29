
alter table "public"."order" drop constraint "order_payment_method_fkey";

DROP TABLE "public"."payment_methods";

DROP TABLE "public"."order";
