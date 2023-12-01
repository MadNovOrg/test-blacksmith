import { gql } from 'urql'

export const KNOWLEDGE_HUB_RESOURCES_QUERY = gql`
  fragment KnowledgeHubResourceDetails on KnowledgeHubResource {
    id
    title
    description
    imageUrl
    url
    publishedDate
    type
    authors
  }

  query KnowledgeHubResources {
    knowledgeHubResources {
      resources {
        ...KnowledgeHubResourceDetails
      }
    }
  }
`
