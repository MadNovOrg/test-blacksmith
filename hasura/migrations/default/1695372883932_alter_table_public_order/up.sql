alter table "public"."xero_invoice"
  drop constraint "xero_invoice_invoice_number_fkey";

alter table "public"."xero_invoice"
  add constraint "xero_invoice_invoice_number_fkey"
  foreign key ("invoice_number")
  references "public"."order"
  ("xero_invoice_number") on update cascade on delete cascade;
