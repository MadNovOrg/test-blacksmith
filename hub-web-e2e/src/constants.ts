const TARGET_ENV = (process.env.TARGET ?? 'local').toLowerCase()

let BASE_URL: string
let HASURA_BASE_URL: string
const HASURA_SECRET = process.env.HASURA_SECRET ?? 'tth-hasura-key'

switch (TARGET_ENV) {
  case 'local':
    BASE_URL = 'http://localhost:3000'
    HASURA_BASE_URL = 'http://localhost:8080'
    break
  case 'dev':
    BASE_URL = 'https://dev.connect.teamteach.com'
    HASURA_BASE_URL = 'https://hasura.dev.teamteachhub.co.uk'
    break
  case 'stg':
    BASE_URL = 'https://stg.connect.teamteach.com'
    HASURA_BASE_URL = 'https://hasura.stg.teamteachhub.co.uk'
    break
  case 'prod':
    BASE_URL = 'https://connect.teamteach.com'
    HASURA_BASE_URL = 'https://hasura.teamteachhub.co.uk'
    break
  case 'github':
    BASE_URL = 'http://localhost:3000'
    HASURA_BASE_URL = 'https://hasura.dev.teamteachhub.co.uk'
}

const TEMP_DIR = './tmp'

const PER_PAGE = 12

const TEST_SETTINGS: { role: undefined | 'tt-admin' | 'admin' } = {
  role: undefined,
}

const UK_TIMEZONE = 'Europe/London'

export {
  TARGET_ENV,
  BASE_URL,
  TEMP_DIR,
  HASURA_BASE_URL,
  HASURA_SECRET,
  PER_PAGE,
  TEST_SETTINGS,
  UK_TIMEZONE,
}
