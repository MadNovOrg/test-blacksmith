import { Meta, StoryObj } from '@storybook/react'

import {
  KnowledgeHubResourceType,
  KnowledgeHubResourcesQuery,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { ResourcesCarousel } from './ResourcesCarousel'

export default {
  title: 'pages/Welcome/ResourcesCarousel',
  component: ResourcesCarousel,
  decorators: [
    story => (
      <FullHeightPageLayout bgcolor="grey.100" height={600} width="100vw">
        {story()}
      </FullHeightPageLayout>
    ),
  ],
} as Meta<typeof ResourcesCarousel>

type Story = StoryObj<typeof ResourcesCarousel>

export const Fetching: Story = {}
Fetching.parameters = {
  urql: () =>
    new Promise(() => {
      return undefined
    }),
}

export const WithResources: Story = {}
WithResources.parameters = {
  urql: () =>
    new Promise<{ data: KnowledgeHubResourcesQuery }>(resolve => {
      resolve({
        data: {
          knowledgeHubResources: {
            resources: [
              {
                id: 'cG9zdDoyMzM0',
                title: 'Developing Positive Self-Reflection Practice',
                description:
                  '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
                publishedDate: '2023-11-27T07:26:00',
                imageUrl:
                  'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
                url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
                type: KnowledgeHubResourceType.Article,
              },
              {
                id: 'cG9zdDoyMzM0',
                title: 'Developing Positive Self-Reflection Practice',
                description:
                  '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
                publishedDate: '2023-11-27T07:26:00',
                imageUrl:
                  'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
                url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
                type: KnowledgeHubResourceType.Podcast,
              },
              {
                id: 'cG9zdDoyMzM0',
                title: 'Developing Positive Self-Reflection Practice',
                description:
                  '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
                publishedDate: '2023-11-27T07:26:00',
                imageUrl:
                  'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
                url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
                type: KnowledgeHubResourceType.Video,
              },
              {
                id: 'cG9zdDoyMzM0',
                title: 'Developing Positive Self-Reflection Practice',
                description:
                  '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
                publishedDate: '2023-11-27T07:26:00',
                imageUrl:
                  'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
                url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
                type: KnowledgeHubResourceType.Download,
              },
              {
                id: 'cG9zdDoyMzM0',
                title: 'Developing Positive Self-Reflection Practice',
                description:
                  '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
                publishedDate: '2023-11-27T07:26:00',
                imageUrl:
                  'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
                url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
                type: KnowledgeHubResourceType.Article,
              },
            ],
          },
        },
      })
    }),
}
