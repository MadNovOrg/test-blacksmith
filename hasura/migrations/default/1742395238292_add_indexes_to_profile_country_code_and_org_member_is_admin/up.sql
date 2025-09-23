
CREATE  INDEX "idx_countryCode" on
  "public"."profile" using btree ("countryCode");

CREATE  INDEX "organization_member_is_admin_idx" on
  "public"."organization_member" using btree ("is_admin");
