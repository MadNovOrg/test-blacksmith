import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import {
  Course_Pricing,
  PricingChangelogQuery,
  PricingChangelogQueryVariables,
} from '@app/generated/graphql'
import { ProfileAvatar } from '@app/modules/profile/components/ProfileAvatar'
import { GET_PRICING_CHANGELOG } from '@app/queries/pricing/get-pricing-changelog'

import { getCourseAttributes } from '../utils'

export type ChangelogModalProps = {
  coursePricing?: Course_Pricing | null
  onClose: () => void
}

const PER_PAGE = 5
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

export const ChangelogModal = ({
  coursePricing,
  onClose,
}: ChangelogModalProps) => {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const [{ data, error }] = useQuery<
    PricingChangelogQuery,
    PricingChangelogQueryVariables
  >({
    query: GET_PRICING_CHANGELOG,
    variables: {
      ...(coursePricing
        ? {
            where: { coursePricingId: { _eq: coursePricing.id } },
          }
        : {}),
      limit: perPage,
      offset: currentPage * perPage,
    },
  })

  const loading = !data && !error
  const changelogTotalCount =
    data?.course_pricing_changelog_aggregate?.aggregate?.count

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth={960}
        slots={{
          Title: () => (
            <Typography variant="h3" ml={3} fontWeight={600} color="secondary">
              {t('pages.course-pricing.modal-changelog-title')}
            </Typography>
          ),
        }}
      >
        <Container>
          <Divider sx={{ mb: 2 }} />

          <Stack direction="row" spacing={5}>
            <Typography
              variant="body1"
              bgcolor="grey.100"
              color="grey.800"
              p={1}
              borderRadius={1}
            >
              {t('pages.course-pricing.cols-course')}
              {': '}
              <Typography
                component="span"
                display={'inline-block'}
                fontWeight="bold"
              >
                {t(`course-levels.${coursePricing?.level}`)}
              </Typography>
            </Typography>

            <Typography
              variant="body1"
              bgcolor="grey.100"
              color="grey.800"
              p={1}
              borderRadius={1}
            >
              {t('pages.course-pricing.cols-type')}
              {': '}
              <Typography
                component="span"
                fontWeight="bold"
                display={'inline-block'}
              >
                {t(`course-types.${coursePricing?.type}`)}
              </Typography>
            </Typography>

            {coursePricing?.reaccreditation || coursePricing?.blended ? (
              <Typography
                variant="body1"
                bgcolor="grey.100"
                color="grey.800"
                p={1}
                borderRadius={1}
              >
                {t('pages.course-pricing.cols-attributes')}
                {': '}
                <Typography
                  component="span"
                  fontWeight="bold"
                  display={'inline-block'}
                >
                  {getCourseAttributes(t, coursePricing)}
                </Typography>
              </Typography>
            ) : null}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t('pages.course-pricing.cols-administrator')}
                </TableCell>
                <TableCell>{t('pages.course-pricing.cols-date')}</TableCell>
                <TableCell>{t('pages.course-pricing.cols-event')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Stack direction="row" alignItems="center">
                      <CircularProgress
                        size={20}
                        data-testid="list-orders-circular-progress"
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : null}

              <TableNoRows
                noRecords={!loading && !data?.course_pricing_changelog.length}
                itemsName={t(
                  'pages.course-pricing.modal-changelog-title'
                ).toLowerCase()}
                colSpan={3}
              />
              {data?.course_pricing_changelog.map(changelog => (
                <TableRow key={changelog.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {changelog.author ? (
                        <ProfileAvatar profile={changelog.author} />
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {t('dates.withTime', { date: changelog.createdAt })}
                  </TableCell>
                  <TableCell>
                    {t('pages.course-pricing.modal-changelog-event', {
                      oldPrice: t('currency', {
                        amount: changelog.oldPrice,
                        currency: coursePricing?.priceCurrency,
                      }),
                      newPrice: t('currency', {
                        amount: changelog.newPrice,
                        currency: coursePricing?.priceCurrency,
                      }),
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {changelogTotalCount ? (
            <TablePagination
              component="div"
              count={changelogTotalCount}
              page={currentPage}
              onPageChange={(_, page) => setCurrentPage(page)}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={perPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              sx={{
                '.MuiTablePagination-toolbar': { pl: 0 },
                '.MuiTablePagination-spacer': { flex: 0 },
                '.MuiTablePagination-displayedRows': {
                  flex: 1,
                  textAlign: 'center',
                },
              }}
            />
          ) : null}

          <Box display="flex" justifyContent="end" mt={2}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onClose}
            >
              {t('common.close-modal')}
            </Button>
          </Box>
        </Container>
      </Dialog>
    </Container>
  )
}
