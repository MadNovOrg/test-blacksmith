import { AwsRegions } from '@app/types'

export const amplifyConfig = {
  [AwsRegions.UK]: {
    Auth: {
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
  [AwsRegions.Australia]: {
    Auth: {
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID_AU,
      userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID_AU,
    },
  },
}
