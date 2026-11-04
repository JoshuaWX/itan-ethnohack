-- Run against an isolated test database after applying migrations.
begin;

do $$
begin
  if pg_catalog.to_regprocedure('public.itan_reserve_assistant_request()') is not null then
    raise exception 'The old anonymous RPC still exists';
  end if;
  if pg_catalog.has_function_privilege('anon', 'public.itan_reserve_provider_calls(text,integer)', 'execute')
    or pg_catalog.has_function_privilege('authenticated', 'public.itan_reserve_provider_calls(text,integer)', 'execute')
    or not pg_catalog.has_function_privilege('service_role', 'public.itan_reserve_provider_calls(text,integer)', 'execute') then
    raise exception 'Unexpected provider quota privileges';
  end if;
end;
$$;

truncate itan_private.provider_client_usage, itan_private.assistant_daily_usage;
set local role service_role;

do $$
begin
  for client in 1..3 loop
    for attempt in 1..4 loop
      if not public.itan_reserve_provider_calls(repeat(client::text, 64), 2) then
        raise exception 'Expected a successful reservation';
      end if;
    end loop;
    if public.itan_reserve_provider_calls(repeat(client::text, 64), 1) then
      raise exception 'Client exceeded its cap';
    end if;
  end loop;
  for attempt in 1..3 loop
    if not public.itan_reserve_provider_calls(repeat('4', 64), 2) then
      raise exception 'Client denial should not consume global budget';
    end if;
  end loop;
  if public.itan_reserve_provider_calls(repeat('5', 64), 1) then
    raise exception 'Global budget exceeded';
  end if;
end;
$$;

rollback;
