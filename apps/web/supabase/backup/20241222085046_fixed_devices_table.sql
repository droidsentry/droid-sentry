alter table "public"."devices" drop constraint "devices_policy_table_id_fkey";

alter table "public"."devices" drop column "policy_table_id";

alter table "public"."devices" add constraint "devices_policy_name_fkey" FOREIGN KEY (policy_name) REFERENCES policies(policy_name) not valid;

alter table "public"."devices" validate constraint "devices_policy_name_fkey";

alter table "public"."pubsub_logs" add constraint "pubsub_logs_device_name_fkey" FOREIGN KEY (device_name) REFERENCES devices(device_name) ON DELETE CASCADE not valid;

alter table "public"."pubsub_logs" validate constraint "pubsub_logs_device_name_fkey";



