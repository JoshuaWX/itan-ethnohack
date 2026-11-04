-- Preserve current daily usage during the upgrade and remove the anonymous entry point.
drop function public.itan_reserve_assistant_request();

create table itan_private.provider_client_usage (
  usage_date date not null,
  client_key text not null,
  request_count integer not null check (request_count between 1 and 8),
  primary key (usage_date, client_key)
);
revoke all on itan_private.provider_client_usage from public, anon, authenticated;
grant usage on schema itan_private to service_role;
grant select, insert, update, delete on itan_private.assistant_daily_usage, itan_private.provider_client_usage to service_role;

create function public.itan_reserve_provider_calls(client_key text, units integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  today date := (pg_catalog.now() at time zone 'UTC')::date;
  used_total integer;
  used_client integer;
begin
  if client_key is null or client_key !~ '^[0-9a-f]{64}$' or units is null or units not between 1 and 2 then
    return false;
  end if;

  insert into itan_private.assistant_daily_usage (usage_date, request_count)
    values (today, 0) on conflict do nothing;
  -- Serialize every reservation for this date before reading or writing client usage.
  select usage.request_count into used_total from itan_private.assistant_daily_usage as usage
    where usage.usage_date = today for update;
  if used_total + units > 30 then return false; end if;

  select usage.request_count into used_client from itan_private.provider_client_usage as usage
    where usage.usage_date = today and usage.client_key = itan_reserve_provider_calls.client_key;
  if coalesce(used_client, 0) + units > 8 then return false; end if;

  insert into itan_private.provider_client_usage values (today, client_key, units)
    on conflict on constraint provider_client_usage_pkey do update
    set request_count = itan_private.provider_client_usage.request_count + units;
  update itan_private.assistant_daily_usage as usage
    set request_count = used_total + units where usage.usage_date = today;

  delete from itan_private.provider_client_usage where usage_date < today;
  delete from itan_private.assistant_daily_usage where usage_date < today;
  return true;
end;
$$;
revoke all on function public.itan_reserve_provider_calls(text, integer) from public, anon, authenticated;
grant execute on function public.itan_reserve_provider_calls(text, integer) to service_role;
