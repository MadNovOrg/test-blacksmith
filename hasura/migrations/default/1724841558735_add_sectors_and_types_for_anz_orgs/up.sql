INSERT INTO organisation_sector (name) VALUES ('ANZ_EDU'), ('ANZ_SS'), ('ANZ_HEALTH');

INSERT INTO organization_type(name, sector, "nonUK") VALUES
('State Education', E'ANZ_EDU', true),
('Catholic Education', E'ANZ_EDU', true),
('Independent Education', E'ANZ_EDU', true),
('Pre-School/Kindergarten', E'ANZ_EDU', true),
('Out of School Care (OSHC)', E'ANZ_EDU', true),
('College & Further Education ', E'ANZ_EDU', true),
('Other', E'ANZ_EDU', true),
('Disability', E'ANZ_SS', true),
('Community & Vulnerable People', E'ANZ_SS', true),
('Child & Family Services', E'ANZ_SS', true),
('Aged Care', E'ANZ_SS', true),
('Other', E'ANZ_SS', true),
('Primary Healthcare', E'ANZ_HEALTH', true),
('State hospital', E'ANZ_HEALTH', true),
('Private hospital', E'ANZ_HEALTH', true);
