import { Box } from '@mui/material'
import { Meta, StoryObj } from '@storybook/react'

import { KnowledgeHubResourceType } from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { ResourceCard } from './ResourceCard'

import withi18nProvider from '@storybook-decorators/withi18nProvider'
import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'pages/Welcome/ResourceCard',
  component: ResourceCard,
  decorators: [
    withMuiThemeProvider,
    withi18nProvider,
    story => (
      <Box width="350px" p={10}>
        {story()}
      </Box>
    ),
    story => (
      <FullHeightPageLayout bgcolor="grey.100" height={600} width="100vw">
        {story()}
      </FullHeightPageLayout>
    ),
  ],
} as Meta<typeof ResourceCard>

export const WithArticleType: StoryObj<typeof ResourceCard> = {}
WithArticleType.args = {
  resource: {
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
}

export const WithVideoType: StoryObj<typeof ResourceCard> = {}
WithVideoType.args = {
  resource: {
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
}

export const WithDownloadType: StoryObj<typeof ResourceCard> = {}
WithDownloadType.args = {
  resource: {
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
}

export const WithPodcastType: StoryObj<typeof ResourceCard> = {}
WithPodcastType.args = {
  resource: {
    id: 'cG9zdDoyMzM0',
    title: 'Developing Positive Self-Reflection Practice',
    description:
      '<p>5 strategies to help individuals focus on positive progress towards goals.</p>\n',
    publishedDate: '2023-11-27T07:26:00',
    imageUrl:
      'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/01060607/Untitled-design-45.jpg',
    url: 'https://knowledgehub.teamteach.com/article/wellbeing-habits-routines-developing-positive-self-reflection-practice/',
    type: KnowledgeHubResourceType.Podcast,
    authors: [
      'https://cdn-kh.teamteach.com/wp-content/uploads/2023/08/16100914/Untitled-design-62-150x150.jpg',
      'https://cdn-kh.teamteach.com/wp-content/uploads/2023/09/16062924/4-150x150.jpg',
    ],
  },
}
