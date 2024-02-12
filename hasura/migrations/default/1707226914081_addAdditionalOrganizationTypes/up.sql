INSERT INTO organisation_sector("name") 
VALUES ('HSC_ADULT'),
('HSC_CHILDREN');

DELETE FROM organization_type
WHERE sector = 'HSC_ADULT_AND_CHILDREN';

ALTER TABLE organization_type
DROP CONSTRAINT "organization_type_name_key";

DELETE FROM organisation_sector
WHERE name = 'HSC_ADULT_AND_CHILDREN';

INSERT INTO organization_type("name", "sector") VALUES
('Primary School','EDU'),
('Secondary School','EDU'),
('SEND School','EDU'),
('Other', 'EDU'),
('Foster Care','HSC_CHILDREN'),
(E'Children\'s home','HSC_ADULT'),
(E'Children\'s home','HSC_CHILDREN'),
('Care home','HSC_ADULT'),
('Care home','HSC_CHILDREN'),
('Secure unit','HSC_ADULT'),
('Secure unit','HSC_CHILDREN'),
('Community centre','HSC_ADULT'),
('Community centre','HSC_CHILDREN'),
('Home worker','HSC_ADULT'),
('Home worker','HSC_CHILDREN'),
('Health centre','HSC_ADULT'),
('Health centre','HSC_CHILDREN'),
('Homeless shelter','HSC_ADULT'),
('Homeless shelter','HSC_CHILDREN'),
('Hospital','HSC_ADULT'),
('Hospital','HSC_CHILDREN'),
('Hostel','HSC_ADULT'),
('Hostel','HSC_CHILDREN'),
('Prison','HSC_ADULT'),
('Prison','HSC_CHILDREN'),
('Residential home','HSC_ADULT'),
('Residential home','HSC_CHILDREN'),
('Residential working in school','HSC_ADULT'),
('Residential working in school','HSC_CHILDREN'),
('Supported housing','HSC_ADULT'),
('Supported housing','HSC_CHILDREN'),
('Other', 'HSC_ADULT'),
('Other', 'HSC_CHILDREN');