alter table "public"."policies" alter column "policy_display_name" set default '''不明''::text'::text;

alter table "public"."subscription_usages" alter column "updated_at" drop default;



