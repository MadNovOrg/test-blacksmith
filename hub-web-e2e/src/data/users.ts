import { StoredCredentialKey } from '@qa/util'

import type { User } from './types'

export const users = {
  admin: {
    id: '22015a3e-8907-4333-8811-85f782265a63',
    givenName: 'Benjamin',
    familyName: 'Admin',
    email: 'adm@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
  },
  ops: {
    givenName: 'Lucas',
    familyName: 'Ops',
    email: 'ops@teamteach.testinator.com',
    password: 'Test12345!',
  },
  userOrgAdmin: {
    id: 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa',
    givenName: 'Alex',
    familyName: 'Admin',
    email: 'org.adm@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
  },
  trainer: {
    givenName: 'John',
    familyName: 'Trainer',
    email: 'trainer@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
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
  trainer3: {
    givenName: 'Three',
    familyName: 'Trainer',
    email: 'trainer03@teamteach.testinator.com',
    password: 'Test12345!',
  },
  trainer4: {
    givenName: 'Two',
    familyName: 'Trainer',
    email: 'trainer02@teamteach.testinator.com',
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
  userWithInvite: {
    givenName: 'Invite',
    familyName: 'User',
    email: 'user.with.invite@teamteach.testinator.com',
    password: 'Test12345!',
  },
  salesAdmin: {
    givenName: 'Sales',
    familyName: 'Admin',
    email: 'sales.adm@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'London First School' },
  },
  ttOrgAdmin: {
    givenName: 'TeamTeach',
    familyName: 'Org-Admin',
    email: 'tt.org.adm@teamteach.testinator.com',
    password: 'Test12345!',
    organization: { name: 'Team Teach' },
  },
} as const satisfies Record<string, User>

export const credentials = [
  { name: 'admin', role: 'Administrator' },
  { name: 'ops', role: 'Operations' },
  { name: 'trainer', role: 'Trainer' },
  { name: 'trainerWithOrg', role: 'Trainer' },
  { name: 'user1', role: 'Individual' },
  { name: 'userOrgAdmin', role: 'Individual' },
  { name: 'salesAdmin', role: 'Sales administrator' },
  // { name: 'ttOrgAdmin', role: 'Individual' },
] as const satisfies { name: StoredCredentialKey; role: string }[]
