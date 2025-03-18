drop policy "Enable insert for authenticated users only" on "public"."enterprises";

drop policy "Policy SELECT" on "public"."enterprises";

create policy "Enable insert for authenticated users only"
on "public"."enterprises"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Policy SELECT"
on "public"."enterprises"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));




