CREATE OR REPLACE FUNCTION public.has_policy_access(policy_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.has_enterprise_access(p.enterprise_id)
  FROM public.policies p
  WHERE p.policy_id = policy_id_param;
$$;