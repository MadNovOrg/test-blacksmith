import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { FullHeightPage } from '@app/components/FullHeightPage'
import theme from '@app/theme'

import { ResourceAreaIcon } from './components/resourceAreaIcon'
import { ResourceListSkeleton } from './components/ResourceAreasSkeleton'
import { ResourceCard } from './components/ResourceCard'
import { useResourceAreas } from './use-resource-areas'

export const ResourceAreas = () => {
  const { t } = useTranslation()

  const { allResourcesByArea, fetching } = useResourceAreas()

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]} pb={3}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {fetching ? (
          <ResourceListSkeleton />
        ) : (
          <>
            <Typography variant="h1">{t('pages.resources.title')}</Typography>
            <Grid container spacing={2} sx={{ mb: 12, mt: 1 }}>
              {allResourcesByArea?.basic?.map(resourceArea => (
                <Grid item xs={4} key={resourceArea.id}>
                  <RouterLink to={`/resources/${resourceArea.id}`}>
                    <ResourceCard
                      icon={
                        <ResourceAreaIcon
                          icon={resourceArea.resouceIcon?.resourceicon}
                        />
                      }
                      title={resourceArea.name ?? ''}
                      description={resourceArea.description ?? ''}
                    />
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h1">
              {t('pages.resources.additional-resources.title')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {allResourcesByArea?.additional?.map(resourceArea => (
                <Grid item xs={6} key={resourceArea.id}>
                  <RouterLink to={`/resources/${resourceArea.id}`}>
                    <ResourceCard
                      icon={
                        <ResourceAreaIcon
                          icon={resourceArea.resouceIcon?.resourceicon}
                        />
                      }
                      title={resourceArea.name ?? ''}
                      description={resourceArea.description ?? ''}
                      align="left"
                    />
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </FullHeightPage>
  )
}
