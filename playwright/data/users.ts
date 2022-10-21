import { User } from './types'

export const users: { [key: string]: User } = {
  admin: {
    givenName: 'Benjamin',
    familyName: 'Admin',
    email: 'admin@teamteach.testinator.com',
    password: 'Test12345!',
  },
  ops: {
    givenName: 'Lucas',
    familyName: 'Ops',
    email: 'ops@teamteach.testinator.com',
    password: 'Test12345!',
  },
  userOrgAdmin: {
    givenName: 'Alex',
    familyName: 'Admin',
    email: 'org.admin@teamteach.testinator.com',
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
  trainer2: {
    givenName: 'Steven',
    familyName: 'Trainer',
    email: 'trainer.and.user@teamteach.testinator.com',
    password: 'Test12345!',
  },
  assistant: {
    givenName: 'Liam',
    familyName: 'Assistant',
    email: 'assistant@teamteach.testinator.com',
    password: 'Test12345!',
  },
  assistant2: {
    givenName: 'Noah',
    familyName: 'Assistant',
    email: 'assistant.with.org@teamteach.testinator.com',
    password: 'Test12345!',
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
    email: 'user1@teamteach.testinator.com',
    password: 'Test12345!',
  },
  user2: {
    givenName: 'Elijah',
    familyName: 'Participant',
    email: 'user2@teamteach.testinator.com',
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
