import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { FilterSearch } from '@app/components/FilterSearch'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { NotFound } from '@app/pages/common/NotFound'

import { useResourceCategory } from '../hooks/useResourceCategory'

import {
  ResourceItemsSkeleton,
  ResourceTitleSkeleton,
} from './components/ResourceItemSkeleton'
import { ResourcesList } from './components/ResourcesList'

export const ResourceCategoryDetails = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [searchTerm, setSearchTerm] = useState('')
  const { id } = useParams()

  const [{ data, fetching }] = useResourceCategory(id, searchTerm)

  const resourceCategory = data?.content?.resourceCategory
  const numberOfResources = useMemo(() => {
    function countResources(category: typeof resourceCategory): number {
      const resourceNum = category?.resources?.nodes?.length ?? 0

      const childResourceNum = category?.children?.nodes?.length
        ? category.children.nodes.reduce(
            (acc, subCategory) => acc + countResources(subCategory),
            0,
          )
        : 0

      return resourceNum + childResourceNum
    }

    return countResources(resourceCategory)
  }, [resourceCategory])

  if (!fetching && !resourceCategory) {
    return <NotFound />
  }
  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]} pb={3}>
      <Helmet>
        <title>
          {t(
            `pages.browser-tab-titles.resources.${resourceCategory?.name
              ?.toLowerCase()
              .replace('&', 'and')
              .replaceAll(' ', '-')}`,
          )}
        </title>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Box width={isMobile ? undefined : 400}>
            <BackButton
              label={t('pages.resources.resource-details.back-to-resources')}
              to="/resources"
            />
            <Box mt={2}>
              {!data && fetching ? (
                <ResourceTitleSkeleton />
              ) : (
                <>
                  <Typography variant="h1" sx={{ mb: 1 }}>
                    {resourceCategory?.name}
                  </Typography>
                  <Typography
                    lineHeight="28px"
                    dangerouslySetInnerHTML={{
                      __html: resourceCategory?.description ?? '',
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              ml: isMobile ? 0 : 4,
              maxHeight: '85vh',
              overflow: 'auto',
              flex: 1,
            }}
          >
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
                <Box mt={4}>
                  {numberOfResources === 0 ? (
                    <Typography sx={{ mt: 4 }}>
                      {t('pages.resources.resource-details.empty')}
                    </Typography>
                  ) : null}

                  {resourceCategory?.resources?.nodes?.length ? (
                    <Box sx={{ mt: 2, mb: 4 }}>
                      <ResourcesList
                        resources={resourceCategory?.resources?.nodes}
                      />
                    </Box>
                  ) : null}
                  {resourceCategory?.children?.nodes?.map(categoryLevelOne => (
                    <Box key={categoryLevelOne?.id} sx={{ mb: 7 }}>
                      {categoryLevelOne?.resources?.nodes?.length ? (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h3" sx={{ mb: 2 }}>
                            {categoryLevelOne?.name}
                          </Typography>
                          <ResourcesList
                            resources={categoryLevelOne?.resources?.nodes}
                          />
                        </Box>
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
                          ) : null,
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
