const TARGET_ENV = (process.env.TARGET ?? 'local').toLowerCase()

let BASE_URL: string
let HASURA_BASE_URL: string
const HASURA_SECRET = process.env.HASURA_SECRET ?? 'tth-hasura-key'

const AWS_REGION = process.env.AWS_REGION ?? 'eu-west-2'

export const isUK = () => {
  return AWS_REGION === 'eu-west-2'
}

switch (TARGET_ENV) {
  case 'local':
    BASE_URL = isUK() ? 'http://localhost:3000' : 'http://localhost:4000'
    HASURA_BASE_URL = isUK() ? 'http://localhost:8080' : 'http://localhost:8081'
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
}

const TEMP_DIR = './tmp'

const PER_PAGE = 12

const TEST_SETTINGS: { role: undefined | 'tt-admin' | 'admin' } = {
  role: undefined,
}

const UK_TIMEZONE = 'Europe/London'
const ANZ_TIMEZONE = 'Australia/Sydney'

export {
  TARGET_ENV,
  BASE_URL,
  TEMP_DIR,
  HASURA_BASE_URL,
  HASURA_SECRET,
  PER_PAGE,
  TEST_SETTINGS,
  UK_TIMEZONE,
  ANZ_TIMEZONE,
  AWS_REGION,
}
