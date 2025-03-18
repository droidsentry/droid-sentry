drop policy "SELECT" on "public"."apps";

drop policy "Policy SELECT" on "public"."enterprises";

drop policy "Authenticated users can view policies" on "public"."policies";

create policy "SELECT"
on "public"."apps"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Policy SELECT"
on "public"."enterprises"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Authenticated users can view policies"
on "public"."policies"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));




