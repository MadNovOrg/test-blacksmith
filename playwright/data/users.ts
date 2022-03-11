import { User } from './types'

export const users: { [key: string]: User } = {
  admin: {
    givenName: 'Benjamin',
    familyName: 'Admin',
    email: 'admin@teamteach.testinator.com',
    password: 'Test12345!',
  },
  trainer: {
    givenName: 'John',
    familyName: 'Trainer',
    email: 'trainer@teamteach.testinator.com',
    password: 'Test12345!',
  },
  trainerWithOrg: {
    givenName: 'Mark',
    familyName: 'Trainer',
    email: 'trainer.with.org@teamteach.testinator.com',
    password: 'Test12345!',
  },
  resetPassword: {
    givenName: 'Logan',
    familyName: 'Password',
    email: 'password@teamteach.testinator.com',
    password: 'Test12345!',
  },
}
