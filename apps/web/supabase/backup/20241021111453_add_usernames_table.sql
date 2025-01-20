create table "public"."usernames" (
    "id" uuid not null,
    "email" text not null,
    "username" text not null,
    "createdAt" timestamp with time zone not null default now()
);


alter table "public"."usernames" enable row level security;

CREATE UNIQUE INDEX usernames_email_key ON public.usernames USING btree (email);

CREATE UNIQUE INDEX usernames_pkey ON public.usernames USING btree (id);

CREATE UNIQUE INDEX usernames_username_key ON public.usernames USING btree (username);

alter table "public"."usernames" add constraint "usernames_pkey" PRIMARY KEY using index "usernames_pkey";

alter table "public"."usernames" add constraint "usernames_email_key" UNIQUE using index "usernames_email_key";

alter table "public"."usernames" add constraint "usernames_username_key" UNIQUE using index "usernames_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.liff_uid()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  SELECT (auth.jwt() ->> 'sub')::text;
END$function$
;

grant delete on table "public"."usernames" to "anon";

grant insert on table "public"."usernames" to "anon";

grant references on table "public"."usernames" to "anon";

grant select on table "public"."usernames" to "anon";

grant trigger on table "public"."usernames" to "anon";

grant truncate on table "public"."usernames" to "anon";

grant update on table "public"."usernames" to "anon";

grant delete on table "public"."usernames" to "authenticated";

grant insert on table "public"."usernames" to "authenticated";

grant references on table "public"."usernames" to "authenticated";

grant select on table "public"."usernames" to "authenticated";

grant trigger on table "public"."usernames" to "authenticated";

grant truncate on table "public"."usernames" to "authenticated";

grant update on table "public"."usernames" to "authenticated";

grant delete on table "public"."usernames" to "service_role";

grant insert on table "public"."usernames" to "service_role";

grant references on table "public"."usernames" to "service_role";

grant select on table "public"."usernames" to "service_role";

grant trigger on table "public"."usernames" to "service_role";

grant truncate on table "public"."usernames" to "service_role";

grant update on table "public"."usernames" to "service_role";



