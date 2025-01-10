import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import accountCard from '@app/assets/account-card.jpg'
import coursesCard from '@app/assets/courses-card2.jpg'
import familyEngagementCard from '@app/assets/family-engagement.jpg'
import knowledgeHubCard from '@app/assets/knowledgehub-card.jpg'
import { useAuth } from '@app/context/auth'
import theme from '@app/theme'

const GridItem: React.FC<
  React.PropsWithChildren<{
    image: string
    title: string
    icon: React.ReactNode
    url: string
    description: string
  }>
> = ({ image, title, description, children, icon, url }) => {
  return (
    <Box
      borderRadius={3}
      bgcolor="white"
      border={1}
      borderColor={theme.colors.lime[400]}
      sx={{ overflow: 'hidden', display: 'block', height: '100%' }}
      component={Link}
      href={url}
      underline="none"
    >
      <Box>
        <img alt={title} src={image} style={{ maxWidth: '100%' }} />
      </Box>

      <Box p={3}>
        <Typography
          variant="h4"
          color="primary"
          fontFamily="Poppins"
          fontWeight={500}
          mb={2}
          display="flex"
        >
          <Box component="span" mr={1} sx={{ color: 'grey' }}>
            {icon}
          </Box>

          {title}
        </Typography>

        <Typography mb={2}>{description}</Typography>
        {children}
      </Box>
    </Box>
  )
}

export const AccountOrFamilyEngagementCard = () => {
  const {
    verified,
    acl: { isUK },
  } = useAuth()
  const { t } = useTranslation('pages', {
    keyPrefix: 'welcome.membership-grid',
  })
  if (!isUK()) {
    return (
      <GridItem
        image={accountCard}
        title={t('account-title')}
        description={t('account-description')}
        icon={<SettingsOutlinedIcon />}
        url={verified ? '/profile' : '/verify'}
      >
        <Button variant="contained" color="lime" fullWidth>
          {t('account-button')}
        </Button>
      </GridItem>
    )
  }
  return (
    <GridItem
      image={familyEngagementCard}
      title={t('fet-title')}
      description={t('fet-description')}
      icon={<SchoolOutlinedIcon />}
      url={import.meta.env.VITE_FAMILY_ENGAGEMENT_TRAINING}
    >
      <Button variant="contained" color="lime" fullWidth>
        {t('fet-button')}
      </Button>
    </GridItem>
  )
}

export const MembershipGrid = () => {
  const {
    acl: { isAustralia },
    verified,
  } = useAuth()
  const { t } = useTranslation('pages', {
    keyPrefix: 'welcome.membership-grid',
  })

  return (
    <Container>
      <Box sx={{ md: { width: '60%' } }} mb={5} mt={8}>
        <Typography
          variant="h4"
          fontWeight={500}
          color="primary"
          fontFamily="Poppins"
          mb={2}
        >
          {t('title')}
        </Typography>
        <Typography lineHeight={1.75} sx={{ width: { md: '70%' } }}>
          {t('description')}
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        sx={{
          '& .grid-item': {
            transition: 'opacity 0.4s',
          },
          ':hover': {
            '& .grid-item': { opacity: 0.5 },
            '& .grid-item:hover': { opacity: 1 },
          },
        }}
      >
        <Grid item md={4} className="grid-item">
          <GridItem
            image={knowledgeHubCard}
            title={t('knowledge-hub-title')}
            description={t('knowledge-hub-description')}
            icon={<AutoStoriesOutlinedIcon />}
            url={
              isAustralia()
                ? import.meta.env.VITE_KNOWLEDGE_HUB_URL_ANZ
                : import.meta.env.VITE_KNOWLEDGE_HUB_URL
            }
          >
            <Button color="lime" variant="contained" fullWidth>
              {t('knowledge-hub-button')}
            </Button>
          </GridItem>
        </Grid>
        <Grid item md={4} className="grid-item">
          <GridItem
            image={coursesCard}
            title={t('courses-title')}
            description={t('courses-description')}
            icon={<FormatListBulletedOutlinedIcon />}
            url={verified ? '/courses' : '/verify'}
          >
            <Button color="lime" variant="contained" fullWidth>
              {t('courses-button')}
            </Button>
          </GridItem>
        </Grid>
        <Grid item md={4} className="grid-item">
          <AccountOrFamilyEngagementCard />
        </Grid>
      </Grid>
    </Container>
  )
}
