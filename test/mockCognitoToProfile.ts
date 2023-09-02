import { DeepPartial } from 'ts-essentials'
import { vi } from 'vitest'

import cognitoToProfile, {
  CognitoProfileDetails,
} from '@app/context/auth/cognitoToProfile'
import { RoleName } from '@app/types'

import { profile } from '@test/providers'

vi.mock('@app/context/auth/cognitoToProfile')

const mock = vi.mocked(cognitoToProfile)

export const defaultCognitoProfile = {
  profile: {
    ...profile,
    adminRights: {
      aggregate: {
        count: 0,
      },
    },
  },
  claims: {
    'x-hasura-user-id': profile?.id ?? '',
    'x-hasura-user-email': profile?.email ?? '',
    'x-hasura-allowed-roles': [RoleName.USER, RoleName.TRAINER],
    'x-hasura-default-role': RoleName.USER,
    'x-hasura-tt-organizations': '{}',
  },
  emailVerified: true,
  isOrgAdmin: false,
} as CognitoProfileDetails

mock.mockResolvedValue(defaultCognitoProfile)

export const mockCognitoToProfile = ({
  profile,
  claims,
}: DeepPartial<typeof defaultCognitoProfile>) => {
  return mock.mockResolvedValueOnce({
    profile: {
      ...defaultCognitoProfile.profile,
      ...profile,
    } as CognitoProfileDetails['profile'],
    claims: {
      ...defaultCognitoProfile.claims,
      ...claims,
    } as CognitoProfileDetails['claims'],
    emailVerified: true,
    isOrgAdmin: false,
  })
}
