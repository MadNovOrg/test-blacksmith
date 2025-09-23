UPDATE organization SET address = COALESCE(address::json->>0, '{}')::jsonb;
