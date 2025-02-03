create table
  public.device_hardware_status (
    enterprise_id text not null,
    device_identifier text not null,
    create_time timestamp with time zone not null,
    battery_temperatures double precision[] null,
    cpu_temperatures double precision[] null,
    gpu_temperatures double precision[] null,
    skin_temperatures double precision[] null,
    cpu_usages double precision[] null,
    created_at timestamp with time zone not null default now(),
    fan_speeds double precision[] null,
    constraint device_hardware_status_pkey primary key (enterprise_id, device_identifier, create_time),
    constraint device_hardware_status_device_fkey foreign key (enterprise_id, device_identifier) references devices (enterprise_id, device_identifier) on delete cascade
  ) tablespace pg_default;
  