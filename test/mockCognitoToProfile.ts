import { DeepPartial } from 'ts-essentials'

import cognitoToProfile from '@app/context/auth/cognitoToProfile'

import { profile } from '@test/providers'
import { RoleName, Profile } from '@app/types'

jest.mock('@app/context/auth/cognitoToProfile')

const mock = jest.mocked(cognitoToProfile)

export const defaultCognitoProfile = {
  token: '5sga!U^K7XpM7cfK*EMB&at5to7yEDP6K546HSX',
  profile,
  claims: {
    'x-hasura-user-id': profile?.id ?? '',
    'x-hasura-user-email': profile?.email ?? '',
    'x-hasura-allowed-roles': [RoleName.USER, RoleName.TRAINER],
    'x-hasura-default-role': RoleName.USER,
    'x-hasura-tt-organizations': '{}',
  },
}

mock.mockResolvedValue(defaultCognitoProfile)

export const mockCognitoToProfile = ({
  token,
  profile,
  claims,
}: DeepPartial<typeof defaultCognitoProfile>) => {
  return mock.mockResolvedValueOnce({
    token: token ?? defaultCognitoProfile.token,
    profile: { ...defaultCognitoProfile.profile, ...profile } as Profile,
    claims: { ...defaultCognitoProfile.claims, ...claims },
  })
}
