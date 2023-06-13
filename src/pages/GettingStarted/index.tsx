import { Breadcrumbs, Container, Grid, Link, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import GettingStartedItem from '@app/components/GettingStartedItem'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

import options from './options'

export const GettingStarted: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useScopedTranslation('pages.getting-started')

  const { id } = useParams()
  const active = options.find(item => item.id === id)

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
      }}
    >
      <BackButton label={t('back-to-homepage')} to="/" />
      <Grid
        container
        gridTemplateColumns="1fr 2fr"
        sx={{
          py: 8,
        }}
        spacing={8}
      >
        <Grid item md={3}>
          <Link href="/getting-started">
            <Typography sx={{ mb: 3 }}>{t('tutorials')}</Typography>
          </Link>

          {options.map(item => (
            <Link href={`/getting-started/${item.id}`} key={item.id}>
              <Typography
                sx={{
                  mb: 1,
                  color: item.id === id ? theme.palette.primary.main : '',
                  fontWeight: item.id === id ? 600 : '',
                }}
              >
                {item.title}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Grid item md={9}>
          <Breadcrumbs sx={{ mb: 1 }}>
            <Link href="/getting-started">
              <Typography>{t('tutorials')}</Typography>
            </Link>
            {active && (
              <Link href={`/getting-started/${active.id}`}>{active.title}</Link>
            )}
          </Breadcrumbs>
          <Typography variant="h1" fontWeight={600} sx={{ mb: 4 }}>
            {active ? active.title : t('title')}
          </Typography>
          {active ? (
            <>
              <Box sx={{ mb: 8 }}>
                {active.steps?.map((step, index) => (
                  <Typography key={`step-${index}`} sx={{ mb: 3 }}>
                    <Box component="span" fontWeight={600}>
                      Step {index + 1}{' '}
                    </Box>
                    {step}
                  </Typography>
                ))}
              </Box>
              <video src={active.video} width="100%" controls />
            </>
          ) : (
            <Grid container spacing={3}>
              {options.map(item => (
                <Grid item key={item.id}>
                  <Link href={`/getting-started/${item.id}`} underline="none">
                    <GettingStartedItem {...item} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}
