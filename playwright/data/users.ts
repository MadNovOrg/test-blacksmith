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
    organization: { name: 'London First School' },
  },
  resetPassword: {
    givenName: 'Logan',
    familyName: 'Password',
    email: 'password@teamteach.testinator.com',
    password: 'Test12345!',
  },
  user1: {
    givenName: 'Oliver',
    familyName: 'Participant',
    email: 'user1g@teamteach.testinator.com',
    password: 'Test12345!',
  },
  user2: {
    givenName: 'Elijah',
    familyName: 'Participant',
    email: 'user2g@teamteach.testinator.com',
    password: 'Test12345!',
  },
  user1WithOrg: {
    givenName: 'William',
    familyName: 'Participant',
    email: 'user1.with.org@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
  },
  user2WithOrg: {
    givenName: 'James',
    familyName: 'Participant',
    email: 'user2.with.org@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
  },
}
