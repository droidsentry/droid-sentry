alter table "public"."service_limits" drop column "max_kitting_per_user";

alter table "public"."service_limits" add column "max_devices_kitting_per_user" integer not null;



