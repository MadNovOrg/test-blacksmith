DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'connect_login_data') THEN
        INSERT INTO user_auth_audits (id, created_at, event_type, sub)
        SELECT id, event_time, 'LOGIN', sub
        FROM connect_login_data;
    END IF;
END
$$;
