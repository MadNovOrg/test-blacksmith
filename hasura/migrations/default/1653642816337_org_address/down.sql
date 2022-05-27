UPDATE organization SET address = ('[' || address::json || ']')::jsonb;
