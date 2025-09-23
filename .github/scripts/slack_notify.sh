#!/usr/bin/env bash

set -eou pipefail
: ${1?JOB_STATUS is required}
: ${2?GH_JOB_URL is required}
: ${3?SLACK_URL is required}

JOB_STATUS=${1}
GH_JOB_URL=${2}
SLACK_URL=${3}

date=$(date +%s)

DATA='{
    "attachments": [
        {
            "mrkdwn_in": [
                "text"
            ],
            "color": "#922B21",
            "pretext": "Application Regression E2E Job Failure",
            "text": "Please use the `above` link",
            "author_name": "GitHub",
            "author_icon": "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
            "title": "Application Regression E2E Tests",
            "title_link": "'"${GH_JOB_URL}"'",
            "fields": [
                {
                    "title": "Job Status",
                    "value": "'"${JOB_STATUS}"'",
                    "short": false
                }
            ],
            "thumb_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            "footer": "Date",
            "ts": "'"${date}"'"
        }
    ]
}'

echo "Sending Slack POST Request"
curl -s -H "Content-Type: application/json" "${SLACK_URL}" -d "${DATA}"
