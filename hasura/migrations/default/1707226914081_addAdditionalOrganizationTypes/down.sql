DELETE FROM organization_type
WHERE sector = 'HSC_CHILDREN' OR sector = 'HSC_ADULT' OR name IN ('Primary School','Secondary School','SEND School','Other');

DELETE FROM organisation_sector 
WHERE name IN ('HSC_ADULT','HSC_CHILDREN');

INSERT INTO organisation_sector("name") 
VALUES ('HSC_ADULT_AND_CHILDREN');

ALTER TABLE ONLY organization_type
    ADD CONSTRAINT "organization_type_name_key" UNIQUE ("name");
    
INSERT INTO organization_type("name", "sector") VALUES
('Foster Care','HSC_ADULT_AND_CHILDREN'),
(E'Children\'s home','HSC_ADULT_AND_CHILDREN'),
('Care home','HSC_ADULT_AND_CHILDREN'),
('Secure unit','HSC_ADULT_AND_CHILDREN'),
('Community centre','HSC_ADULT_AND_CHILDREN'),
('Home worker','HSC_ADULT_AND_CHILDREN'),
('Health centre','HSC_ADULT_AND_CHILDREN'),
('Homeless shelter','HSC_ADULT_AND_CHILDREN'),
('Hospital','HSC_ADULT_AND_CHILDREN'),
('Hostel','HSC_ADULT_AND_CHILDREN'),
('Prison','HSC_ADULT_AND_CHILDREN'),
('Residential home','HSC_ADULT_AND_CHILDREN'),
('Residential working in school','HSC_ADULT_AND_CHILDREN'),
('Supported housing','HSC_ADULT_AND_CHILDREN');