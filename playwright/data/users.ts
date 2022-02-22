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
}
