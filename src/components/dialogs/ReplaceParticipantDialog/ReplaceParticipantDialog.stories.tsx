import { ComponentMeta } from '@storybook/react'
import { Client, CombinedError, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ReplaceParticipantError,
  ReplaceParticipantMutation,
} from '@app/generated/graphql'

import {
  Mode,
  Props,
  ReplaceParticipantDialog,
} from './ReplaceParticipantDialog'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/dialogs/ReplaceParticipantDialog',
  component: ReplaceParticipantDialog,
  decorators: [withMuiThemeProvider],
  argTypes: {
    onClose: { action: 'cancelled' },
    onSuccess: { action: 'replaced' },
  },
} as ComponentMeta<typeof ReplaceParticipantDialog>

const participant: Props['participant'] = {
  id: 'some-id',
  fullName: 'Joel Williamson',
  avatar: 'https://mui.com/static/images/avatar/1.jpg',
}

export const WithFetchingState = () => {
  const client = {
    executeMutation: () => never,
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog participant={participant} />
    </Provider>
  )
}

export const WithErrorState = () => {
  const client = {
    executeMutation: () =>
      fromValue<{ data: ReplaceParticipantMutation }>({
        data: {
          replaceParticipant: {
            success: false,
            error: ReplaceParticipantError.GenericError,
          },
        },
      }),
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog participant={participant} />
    </Provider>
  )
}

export const WithGQLError = () => {
  const client = {
    executeMutation: () =>
      fromValue({
        error: new CombinedError({ networkError: Error('network error') }),
      }),
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog participant={participant} />
    </Provider>
  )
}

export const WithSuccess = () => {
  const client = {
    executeMutation: () =>
      fromValue<{ data: ReplaceParticipantMutation }>({
        data: {
          replaceParticipant: {
            success: true,
          },
        },
      }),
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog
        participant={participant}
        onSuccess={() => console.log('success')}
      />
    </Provider>
  )
}

export const AsOrgAdmin = () => {
  const client = {
    executeMutation: () =>
      fromValue<{ data: ReplaceParticipantMutation }>({
        data: {
          replaceParticipant: {
            success: true,
          },
        },
      }),
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog
        participant={participant}
        onSuccess={() => console.log('success')}
        mode={Mode.ORG_ADMIN}
      />
    </Provider>
  )
}

export const WithParticipantExistsError = () => {
  const client = {
    executeMutation: () =>
      fromValue<{ data: ReplaceParticipantMutation }>({
        data: {
          replaceParticipant: {
            success: false,
            error: ReplaceParticipantError.InvalidEmail,
          },
        },
      }),
    executeQuery: () => never,
  } as unknown as Client

  return (
    <Provider value={client}>
      <ReplaceParticipantDialog participant={participant} />
    </Provider>
  )
}
