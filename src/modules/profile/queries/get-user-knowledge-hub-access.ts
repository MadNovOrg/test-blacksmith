import { gql } from 'urql'

export const GET_USER_KNOWLEDGE_HUB_ACCESS = gql`
  query GetUserKnowledgeHubAccess($profileId: uuid!) {
    organization_member_aggregate(
      where: {
        profile_id: { _eq: $profileId }
        organization: { canAccessKnowledgeHub: { _eq: true } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
