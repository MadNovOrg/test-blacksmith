type Base = {
  id: string
  createdAt: string
  updatedAt: string
}

export type Course = {
  name: string
  date: Date
  orgName: string
  color: string
} & Base

export type CourseModule = {
  name: string
  description: string
} & Base

export type Address = {
  line1: string
  line2: string
  city: string
  state: string
  postCode: string
  country: string
  type: string
} & Base

export type ContactDetail = {
  type: string
  value: string
}

export type Organization = {
  name: string
  tags: string[]
  status: string
  contactDetails: ContactDetail[]
  attributes: { [name: string]: string }
  addresses: Address[]
  preferences: { [name: string]: string }
} & Base

export type Profile = {
  givenName: string
  familyName: string
  title: string
  // tags
  // status
  // addresses
  // attributes
  // contactDetails
  // preferences
  // status
} & Base

export type Module = {
  name: string
  description: string
  level: string
  type: string
} & Base

export type ModuleGroup = {
  name: string
  level: string
  modules: Module[]
} & Base
