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
    BASE_URL = 'https://web.dev.teamteachhub.co.uk'
    HASURA_BASE_URL = 'https://hasura.dev.teamteachhub.co.uk'
    break
  case 'stg':
    BASE_URL = 'https://web.stg.teamteachhub.co.uk'
    HASURA_BASE_URL = 'https://hasura.stg.teamteachhub.co.uk'
    break
  case 'prod':
    BASE_URL = 'https://teamteachhub.co.uk'
    HASURA_BASE_URL = 'https://hasura.teamteachhub.co.uk'
    break
}

const TEMP_DIR = './tmp'

const PER_PAGE = 12

const TEST_SETTINGS: { role: undefined | 'tt-admin' } = {
  role: undefined,
}

export {
  TARGET_ENV,
  BASE_URL,
  TEMP_DIR,
  HASURA_BASE_URL,
  HASURA_SECRET,
  PER_PAGE,
  TEST_SETTINGS,
}
