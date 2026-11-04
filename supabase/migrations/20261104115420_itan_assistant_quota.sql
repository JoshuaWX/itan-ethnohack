create schema if not exists itan_private;
revoke all on schema itan_private from public, anon, authenticated;
create table itan_private.assistant_daily_usage (
  usage_date date primary key,
  request_count integer not null check (request_count >= 0)
);
revoke all on itan_private.assistant_daily_usage from public, anon, authenticated;
create function public.itan_reserve_assistant_request() returns boolean
language plpgsql security definer set search_path = '' as $$
declare reserved integer;
begin
  insert into itan_private.assistant_daily_usage (usage_date, request_count)
  values ((pg_catalog.now() at time zone 'UTC')::date, 1)
  on conflict (usage_date) do update
    set request_count = itan_private.assistant_daily_usage.request_count + 1
    where itan_private.assistant_daily_usage.request_count < 30
  returning request_count into reserved;
  return reserved is not null;
end;
$$;
revoke all on function public.itan_reserve_assistant_request() from public;
grant execute on function public.itan_reserve_assistant_request() to anon, authenticated;
