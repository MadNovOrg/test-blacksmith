import { users } from './data/users'

const TARGET_ENV = process.env.TARGET ?? 'local'

let BASE_URL: string
let DEFAULT_USER: { email: string; password: string }

switch (TARGET_ENV) {
  case 'local':
    BASE_URL = 'http://localhost:3000'
    DEFAULT_USER = users.admin
    break
  case 'dev':
    BASE_URL = 'https://web.dev.teamteachhub.co.uk'
    DEFAULT_USER = users.admin
    break
}

const TEMP_DIR = './tmp'

export { TARGET_ENV, BASE_URL, DEFAULT_USER, TEMP_DIR }
