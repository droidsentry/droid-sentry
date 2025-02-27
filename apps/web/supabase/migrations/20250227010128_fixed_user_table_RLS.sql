drop policy "Policy with security definer functions" on "public"."users";

create policy "DELETE"
on "public"."users"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "SELECT"
on "public"."users"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "UPDATE"
on "public"."users"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));




