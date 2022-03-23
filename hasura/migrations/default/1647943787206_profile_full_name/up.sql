CREATE FUNCTION profile_full_name(profile_row profile)
RETURNS TEXT AS $$
  SELECT profile_row.given_name || ' ' || profile_row.family_name
$$ LANGUAGE sql STABLE;
