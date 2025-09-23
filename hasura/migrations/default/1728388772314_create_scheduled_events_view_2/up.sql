DROP VIEW IF EXISTS scheduled_events_view;

CREATE VIEW scheduled_events_view AS
SELECT * FROM hdb_catalog.hdb_scheduled_events;
