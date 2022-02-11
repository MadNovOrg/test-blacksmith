const targetEnv = process.env.TARGET ?? 'local'

let BASE_URL: string
let DEFAULT_USER: { email: string; password: string }

switch (targetEnv) {
  case 'local':
    BASE_URL = 'http://localhost:3000'
    DEFAULT_USER = {
      email: 'maksym.barvinskyi@nearform.com',
      password: 'Test12345!',
    }
    break
  case 'dev':
    BASE_URL = 'https://web.dev.teamteachhub.co.uk'
    DEFAULT_USER = {
      email: 'maksym.barvinskyi@nearform.com',
      password: 'Test12345!',
    }
    break
}

export { BASE_URL, DEFAULT_USER }
