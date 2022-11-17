import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined'
import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { FullHeightPage } from '@app/components/FullHeightPage'
import theme from '@app/theme'

import { ResourceCard } from './components/ResourceCard'

export const ResourcesList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]} pb={3}>
      <Container maxWidth="lg" sx={{ py: 5 }} disableGutters>
        <Typography variant="h1">{t('pages.resources.title')}</Typography>
        <Grid container spacing={2} sx={{ mb: 12, mt: 1 }}>
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<AutoStoriesOutlinedIcon color="warning" />}
            title="Legislation, research & guidance"
            description="National government legislation, internal and external research, and guidance on positive handling strategies and techniques ."
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<PlayCircleOutlinedIcon color="error" />}
            title="Technique videos"
            description="Demonstrations on how to safely deliver Team Teach’s positive handling techniques and holds."
            onClick={() => navigate(`/resources/details`)}
          />
        </Grid>
        <Typography variant="h1">
          {t('pages.resources.additional-resources.title')}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
          <ResourceCard
            icon={<TopicOutlinedIcon color="success" />}
            title="Best practice & templates"
            description="Sample policies, positive behaviour plans and risk assessments
            shared by other course participants."
            align="left"
            xs={6}
            onClick={() => navigate(`/resources/details`)}
          />
        </Grid>
      </Container>
    </FullHeightPage>
  )
}
