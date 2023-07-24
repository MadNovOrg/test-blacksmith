import {
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'

import { ResourceAreaIcon } from './components/resourceAreaIcon'
import { ResourceListSkeleton } from './components/ResourceAreasSkeleton'
import { ResourceCard } from './components/ResourceCard'
import { useResourceAreas } from './use-resource-areas'

export const ResourceAreas = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { allResourcesByArea, fetching } = useResourceAreas()

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {fetching ? (
          <Box data-testid="resources-list-skeleton">
            <Box mb={12}>
              <ResourceListSkeleton num={3} perRow={3} withTitle />
            </Box>
            <Box>
              <ResourceListSkeleton num={2} perRow={2} withTitle />
            </Box>
          </Box>
        ) : (
          <>
            {allResourcesByArea?.basic?.length ? (
              <Box>
                <Typography
                  textAlign={isMobile ? 'center' : 'left'}
                  variant="h1"
                >
                  {t('pages.resources.title')}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 12, mt: 1 }}>
                  {allResourcesByArea?.basic?.map(resourceArea => (
                    <Grid item md={4} xs={12} key={resourceArea.id}>
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
              </Box>
            ) : null}

            {allResourcesByArea?.additional?.map ? (
              <Box>
                <Typography
                  textAlign={isMobile ? 'center' : 'left'}
                  variant="h1"
                >
                  {t('pages.resources.additional-resources.title')}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {allResourcesByArea?.additional?.map(resourceArea => (
                    <Grid item md={6} xs={12} key={resourceArea.id}>
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
              </Box>
            ) : null}
          </>
        )}
      </Container>
    </FullHeightPageLayout>
  )
}
