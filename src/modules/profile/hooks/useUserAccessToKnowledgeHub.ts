import { useQuery } from 'urql'

import {
  GetUserKnowledgeHubAccessQuery,
  GetUserKnowledgeHubAccessQueryVariables,
} from '@app/generated/graphql'

import { GET_USER_KNOWLEDGE_HUB_ACCESS } from '../queries/get-user-knowledge-hub-access'

export const useUserAccessToKnowledgeHub = (profileId: string) => {
  return useQuery<
    GetUserKnowledgeHubAccessQuery,
    GetUserKnowledgeHubAccessQueryVariables
  >({
    query: GET_USER_KNOWLEDGE_HUB_ACCESS,
    variables: {
      profileId,
    },
  })
}
