import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { useCourseDrafts } from '@app/modules/trainer_courses/hooks/useCourseDrafts'
import { RoleName } from '@app/types'

import { DraftsTable } from '../../components/DraftsTable'

export type Props = {
  title?: string
  orgId?: string
}

export const DraftCourses: React.FC<React.PropsWithChildren<Props>> = ({
  title,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { activeRole, profile } = useAuth()
  const isTrainer = activeRole === RoleName.TRAINER

  const sorting = useTableSort('created_at', 'desc')

  const { Pagination, perPage, currentPage } = useTablePagination({
    initialPerPage: 12,
    id: 'draft-courses',
  })

  const { drafts, loading, total } = useCourseDrafts({
    sorting,
    pagination: {
      perPage,
      currentPage,
    },
    profileId: profile?.id ?? '',
  })

  return (
    <>
      <Helmet>
        <title>{t('pages.browser-tab-titles.my-courses.drafts')}</title>
      </Helmet>
      <SnackbarMessage messageKey="draft-saved" sx={{ position: 'absolute' }} />
      <Container
        maxWidth="lg"
        sx={{ py: 5, position: 'relative' }}
        disableGutters={!isMobile}
      >
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
          <Box width={isMobile ? undefined : 250} mb={2}>
            <Typography variant="h1">
              {title ??
                t(
                  isTrainer
                    ? 'pages.draft-courses.h1'
                    : 'pages.draft-courses.h1',
                )}
            </Typography>
          </Box>
        </Box>
        <Box flex={1} sx={{ overflowX: 'auto' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <DraftsTable
              drafts={drafts}
              isFiltered={false}
              sorting={sorting}
              loading={loading}
              data-testid="drafts-table"
              hiddenColumns={new Set([])}
            />

            {total ? (
              <Pagination testId="courses-pagination" total={total} />
            ) : null}
          </Box>
        </Box>
      </Container>
    </>
  )
}
