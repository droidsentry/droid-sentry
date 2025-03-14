create table "public"."waiting_users" (
    "user_id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "email" text not null,
    "status" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."waiting_users" enable row level security;

CREATE UNIQUE INDEX waiting_users_email_key ON public.waiting_users USING btree (email);

CREATE UNIQUE INDEX waiting_users_pkey ON public.waiting_users USING btree (user_id);

CREATE UNIQUE INDEX waiting_users_username_key ON public.waiting_users USING btree (username);

alter table "public"."waiting_users" add constraint "waiting_users_pkey" PRIMARY KEY using index "waiting_users_pkey";

alter table "public"."waiting_users" add constraint "waiting_users_email_key" UNIQUE using index "waiting_users_email_key";

alter table "public"."waiting_users" add constraint "waiting_users_username_key" UNIQUE using index "waiting_users_username_key";

grant delete on table "public"."waiting_users" to "anon";

grant insert on table "public"."waiting_users" to "anon";

grant references on table "public"."waiting_users" to "anon";

grant select on table "public"."waiting_users" to "anon";

grant trigger on table "public"."waiting_users" to "anon";

grant truncate on table "public"."waiting_users" to "anon";

grant update on table "public"."waiting_users" to "anon";

grant delete on table "public"."waiting_users" to "authenticated";

grant insert on table "public"."waiting_users" to "authenticated";

grant references on table "public"."waiting_users" to "authenticated";

grant select on table "public"."waiting_users" to "authenticated";

grant trigger on table "public"."waiting_users" to "authenticated";

grant truncate on table "public"."waiting_users" to "authenticated";

grant update on table "public"."waiting_users" to "authenticated";

grant delete on table "public"."waiting_users" to "service_role";

grant insert on table "public"."waiting_users" to "service_role";

grant references on table "public"."waiting_users" to "service_role";

grant select on table "public"."waiting_users" to "service_role";

grant trigger on table "public"."waiting_users" to "service_role";

grant truncate on table "public"."waiting_users" to "service_role";

grant update on table "public"."waiting_users" to "service_role";



