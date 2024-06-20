CREATE OR REPLACE VIEW courses_by_month AS
SELECT
    DATE_TRUNC('month', cs.start) AS month,
    c.course_type as course_type,
    COUNT(*) AS course_count
FROM
    course_schedule AS cs
    JOIN course AS c ON cs.course_id = c.id
WHERE
    c.course_status <> 'cancelled'
    AND cs.start > '2024-01-01'
    AND cs.start < NOW()
GROUP BY
    month,
    course_type
ORDER BY
    month,
    course_type;
 
CREATE OR REPLACE VIEW course_certificates_by_month AS
SELECT
    DATE_TRUNC('month', cc.certification_date) AS month,
    c.course_type AS course_type,
    COUNT(*) AS course_certificate_count
FROM
    course_certificate AS cc
    JOIN course AS c ON cc.course_id = c.id
    JOIN course_participant as cp ON cp.certificate_id = cc.id
WHERE
    cc.certification_date > '2024-01-01'
    AND cp.completed_evaluation = TRUE
    AND cc.certification_date < NOW()
GROUP BY
    month,
    course_type
ORDER BY
    month,
    course_type;
 
CREATE OR REPLACE VIEW certificate_organisations_by_month AS
SELECT
    DATE_TRUNC('month', cc.certification_date) AS month,
    c.course_type AS course_type,
    COUNT(*) AS organisations_count
FROM
    organization AS o
    JOIN organization_member AS om ON o.id = om.organization_id
    JOIN profile AS p on p.id = om.profile_id
    JOIN course_certificate AS cc ON cc.profile_id = p.id
    JOIN course_participant AS cp ON cc.id = cp.certificate_id
    JOIN course AS c ON c.id = cc.course_id
WHERE
    cc.certification_date > '2024-01-01'
    AND cp.completed_evaluation = TRUE
    AND cc.certification_date < NOW()
GROUP BY
    month,
    course_type
ORDER BY 
    month,
    course_type;

CREATE OR REPLACE VIEW hubspot_dashboard_report AS
SELECT
    CONCAT(TO_CHAR(cbm.month, 'YYYY-MM'), cbm.course_type) AS id,
    TO_CHAR(cbm.month, 'YYYY-MM') AS month,
    cbm.course_type AS course_type,
    COALESCE(cbm.course_count, 0) AS course_count,
    COALESCE(ccbm.course_certificate_count, 0) AS course_certificate_count,
    COALESCE(cobm.organisations_count,0) AS organization_count
FROM
    courses_by_month AS cbm
    LEFT JOIN course_certificates_by_month as ccbm ON cbm.month = ccbm.month AND cbm.course_type = ccbm.course_type
    LEFT JOIN certificate_organisations_by_month as cobm ON cbm.month = cobm.month AND cbm.course_type = cobm.course_type
ORDER BY
    month;
 