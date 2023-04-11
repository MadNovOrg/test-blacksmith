import { Box, Container, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { FilterSearch } from '@app/components/FilterSearch'
import { FullHeightPage } from '@app/components/FullHeightPage'
import {
  ResourceDetailsQuery,
  ResourceDetailsQueryVariables,
} from '@app/generated/graphql'
import { RESOURCE_DETAILS_QUERY } from '@app/pages/Resources/queries/get-resource-details'
import theme from '@app/theme'

import {
  ResourceItemsSkeleton,
  ResourceTitleSkeleton,
} from './components/ResourceItemSkeleton'
import { ResourcesList } from './components/ResourcesList'

export const ResourceDetails = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const { id } = useParams()

  const [{ data, fetching }] = useQuery<
    ResourceDetailsQuery,
    ResourceDetailsQueryVariables
  >({
    query: RESOURCE_DETAILS_QUERY,
    variables: {
      id: String(id),
      term: searchTerm,
    },
  })

  const resourceCategory = data?.content?.resourceCategory

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]} pb={3}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex">
          <Box width={300}>
            <BackButton
              label={t('pages.resources.resource-details.back-to-resources')}
              to="/resources"
            />
            {!data ? (
              <ResourceTitleSkeleton />
            ) : (
              <>
                <Typography variant="h1" sx={{ mb: 1, mt: 2 }}>
                  {resourceCategory?.name}
                </Typography>
                <Typography lineHeight="28px">
                  {resourceCategory?.description}
                </Typography>
              </>
            )}
          </Box>
          <Box width={630} sx={{ ml: 1, maxHeight: '85vh', overflow: 'auto' }}>
            <Box sx={{ pt: 2 }}>
              <FilterSearch
                onChange={value => {
                  setSearchTerm(value)
                }}
                placeholder={t('pages.resources.resource-details.search')}
                value={searchTerm}
                fullWidth
              />
              {fetching ? (
                <ResourceItemsSkeleton />
              ) : (
                <>
                  {resourceCategory?.resources?.nodes ? (
                    <Box sx={{ mt: 2, mb: 4 }}>
                      <ResourcesList
                        resources={resourceCategory?.resources?.nodes}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ mb: 1 }}>
                      {t('pages.resources.resource-details.empty')}
                    </Typography>
                  )}

                  {resourceCategory?.children?.nodes?.map(categoryLevelOne => (
                    <Box key={categoryLevelOne?.id} sx={{ mb: 7 }}>
                      {categoryLevelOne?.resources?.nodes?.length ? (
                        <>
                          <Typography variant="h3" sx={{ mb: 2 }}>
                            {categoryLevelOne?.name}
                          </Typography>
                          <ResourcesList
                            resources={categoryLevelOne?.resources?.nodes}
                          />
                        </>
                      ) : null}

                      {categoryLevelOne?.children?.nodes?.map(
                        categoryLevelTwo =>
                          categoryLevelTwo?.resources?.nodes?.length ? (
                            <Box key={categoryLevelTwo?.id} sx={{ mb: 4 }}>
                              <Typography sx={{ mb: 1 }}>
                                {categoryLevelTwo?.name}
                              </Typography>
                              <ResourcesList
                                resources={categoryLevelTwo?.resources?.nodes}
                              />
                            </Box>
                          ) : null
                      )}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPage>
  )
}
