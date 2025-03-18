CREATE OR REPLACE FUNCTION public.has_device_access(device_uuid_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.has_enterprise_access(d.enterprise_id)
  FROM public.devices d
  WHERE d.id = device_uuid_param;
$$;