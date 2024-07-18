import { useQuery } from 'urql'

import { KNOWLEDGE_HUB_RESOURCES_QUERY } from '../queries/knowledge-hub-resources'

export function useKnowledgeHubResources() {
  return useQuery({
    query: KNOWLEDGE_HUB_RESOURCES_QUERY,
  })
}
