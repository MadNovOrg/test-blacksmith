alter table "public"."org_resource_packs_pricing_changelog"
  add constraint "org_resource_packs_pricing_ch_org_resource_packs_pricing_i_fkey"
  foreign key ("org_resource_packs_pricing_id")
  references "public"."org_resource_packs_pricing"
  ("id") on update cascade on delete cascade;
