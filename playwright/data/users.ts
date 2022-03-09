import { User } from './types'

export const users: { [key: string]: User } = {
  admin: {
    givenName: 'Maksym',
    familyName: 'Barvinskyi',
    email: 'maksym.barvinskyi@nearform.com',
    password: 'Test12345!',
  },
  trainer: {
    givenName: 'John',
    familyName: 'Trainer',
    email: 'trainer@teamteach.testinator.com',
    password: 'Test12345!',
  },
  resetPassword: {
    givenName: 'Logan',
    familyName: 'Password',
    email: 'password@teamteach.testinator.com',
    password: 'Test12345!',
  },
}
