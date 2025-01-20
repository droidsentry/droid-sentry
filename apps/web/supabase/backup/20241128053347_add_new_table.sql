set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_project_user(project_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = is_project_user.project_id
    AND project_members.user_id = auth.uid()
  );
END;$function$
;



