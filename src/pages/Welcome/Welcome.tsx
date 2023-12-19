import { Button, Container, Stack } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import teamsImg from './assets/teams.png'
import trainersImg from './assets/trainers.png'
import { Hero } from './components/Hero/Hero'
import { MembershipGrid } from './components/MembershipGrid/MembershipGrid'
import { ResourcesCarousel } from './components/ResourcesCarousel/ResourcesCarousel'
import { SplitImage } from './components/SplitImage/SplitImage'

export const Welcome = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'welcome' })

  return (
    <FullHeightPageLayout bgcolor="grey.100" pb={10}>
      <Helmet>
        <title>{t('meta-title')}</title>
      </Helmet>
      <Hero />
      <MembershipGrid />

      <ResourcesCarousel />

      <Container sx={{ mt: 20 }}>
        <Stack spacing={5}>
          <SplitImage
            image={trainersImg}
            title={t('trainers-title')}
            description={t('trainers-description')}
            imagePosition="left"
          >
            <Button
              color="lime"
              variant="contained"
              href="/courses"
              LinkComponent={LinkBehavior}
            >
              {t('trainers-button')}
            </Button>
          </SplitImage>
          <SplitImage
            image={teamsImg}
            title={t('teams-title')}
            description={t('teams-description')}
            imagePosition="right"
          >
            <Button
              variant="contained"
              color="lime"
              href={import.meta.env.VITE_HUBSPOT_WELCOME_FORM_LINK}
            >
              {t('teams-button')}
            </Button>
          </SplitImage>
        </Stack>
      </Container>
    </FullHeightPageLayout>
  )
}
