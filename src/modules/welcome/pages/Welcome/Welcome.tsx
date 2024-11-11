import { Button, Container, Stack } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import teamsImg from '@app/assets/teams.png'
import trainersImg from '@app/assets/trainers.png'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { Hero } from '../../components/Hero/Hero'
import { MembershipGrid } from '../../components/MembershipGrid/MembershipGrid'
import { ResidingCountryDialog } from '../../components/ResidingCountryDialog/ResidingCountryDialog'
import { ResourcesCarousel } from '../../components/ResourcesCarousel/ResourcesCarousel'
import { SplitImage } from '../../components/SplitImage/SplitImage'

export const Welcome = () => {
  const { verified } = useAuth()
  const { t } = useTranslation('pages', { keyPrefix: 'welcome' })

  return (
    <FullHeightPageLayout bgcolor="grey.100" pb={10}>
      <Helmet>
        <title>{t('meta-title')}</title>
      </Helmet>
      <Hero />
      <MembershipGrid />

      <ResidingCountryDialog />
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
              href={verified ? '/courses' : '/verify'}
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
