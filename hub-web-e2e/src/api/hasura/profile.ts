import { Chance } from 'chance'
import { gql } from 'graphql-request'

import {
  ProfileByEmailQuery,
  ProfileByEmailQueryVariables,
} from '@qa/generated/graphql'

import { getClient } from './client'

const client = getClient()
const chance = new Chance()

export const getProfileId = async (email: string): Promise<string> => {
  const query = gql`
    query ProfileByEmail($email: String!) {
      profile(where: { email: { _eq: $email } }) {
        id
      }
    }
  `
  const response = await client.request<
    ProfileByEmailQuery,
    ProfileByEmailQueryVariables
  >(query, { email })
  console.log(`Email: ${email}, Profile ID: ${response.profile[0].id}`)
  return response.profile[0].id
}

type InsertProfileResponse = {
  insert_profile_one: {
    id: string
  }
}
const INSERT_DUMMY_PROFILE = gql`
  mutation InsertProfile(
    $email: String!
    $givenName: String!
    $familyName: String!
  ) {
    insert_profile_one(
      object: {
        _email: $email
        _given_name: $givenName
        _family_name: $familyName
      }
    ) {
      id
    }
  }
`

export const insertDummyUserProfile = async () => {
  const userDataPayload = {
    email: chance.email(),
    givenName: chance.name(),
    familyName: chance.name(),
  }

  try {
    const response = await client.request<InsertProfileResponse>(
      INSERT_DUMMY_PROFILE,
      userDataPayload,
    )

    const profileId = response.insert_profile_one.id

    console.log(`Inserted profile with ID "${profileId}"`)
    return profileId
  } catch (error) {
    throw new Error(`Failed to create profile: ${error}`)
  }
}
