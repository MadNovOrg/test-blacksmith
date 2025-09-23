UPDATE organization o
SET dfe_establishment_id = (
    SELECT dfe.id
    FROM dfe_establishment dfe
    WHERE o.name = dfe.name
      AND o.attributes->>'localAuthority' = dfe.local_authority 
      AND (
          (CASE WHEN dfe.address_line_1 IS NOT NULL THEN dfe.address_line_1 = o.address->>'line1' ELSE TRUE END)
          AND (CASE WHEN dfe.address_line_2 IS NOT NULL THEN dfe.address_line_2 = o.address->>'line2' ELSE TRUE END)
          AND (CASE WHEN dfe.postcode IS NOT NULL THEN dfe.postcode = o.address->>'postCode' ELSE TRUE END)
          AND (CASE WHEN dfe.head_first_name IS NOT NULL THEN dfe.head_first_name = o.attributes->>'headFirstName' ELSE TRUE END)
          AND (CASE WHEN dfe.head_last_name IS NOT NULL THEN dfe.head_last_name = o.attributes->>'headSurname' OR dfe.head_last_name = o.attributes->>'headLastName' ELSE TRUE END)
          AND (CASE WHEN dfe.head_job_title IS NOT NULL THEN (dfe.head_job_title = o.attributes->>'settingName' OR dfe.head_job_title = o.attributes->>'headPreferredJobTitle') ELSE TRUE END)
          AND (CASE WHEN dfe.ofsted_rating IS NOT NULL THEN dfe.ofsted_rating ILIKE o.attributes->>'ofstedRating' ELSE TRUE END)
      )
    LIMIT 1
)
WHERE o.dfe_establishment_id IS NULL
AND o.name IN (SELECT name FROM dfe_establishment);
