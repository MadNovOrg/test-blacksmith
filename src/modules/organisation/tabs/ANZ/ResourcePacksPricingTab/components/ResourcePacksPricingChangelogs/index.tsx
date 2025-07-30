import {
  Box,
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

import { Dialog } from '@app/components/dialogs'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import {
  Course_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'

import { useOrgResourcePacksPricingGetChangeEvent } from './hooks/use-org-resource-packs-pricing-change-event'
import { useOrgResourcePacksPricingChangelogs } from './hooks/use-org-resource-packs-pricing-changelogs'
import { useResourcePacksPricingAttributes } from './hooks/use-resource-packs-pricing-attributes'

const PER_PAGE = 5
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

export const ResourcePacksPricingChangelogs = ({
  onClose,
  open,
  orgId,
  resourcePacksPricingIds,
}: {
  onClose: () => void
  open: boolean
  orgId: string
  resourcePacksPricingIds: string[]
}) => {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const { changelogs, loading, resourcePacksPricingCommonDetails, totalCount } =
    useOrgResourcePacksPricingChangelogs({
      currentPage: currentPage,
      orgId,
      perPage,
      resourcePacksPricingIds,
    })

  const getResourcePacksPricingAttributes = useResourcePacksPricingAttributes()
  const getOrgResourcePacksPricingChangeEvent =
    useOrgResourcePacksPricingGetChangeEvent()

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  return (
    <Dialog
      open={open}
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
              {t(
                `course-levels.${resourcePacksPricingCommonDetails?.course_level}`,
              )}
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
              {t(
                `course-types.${resourcePacksPricingCommonDetails?.course_type}`,
              )}
            </Typography>
          </Typography>

          {resourcePacksPricingCommonDetails ? (
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
                {getResourcePacksPricingAttributes({
                  courseType: resourcePacksPricingCommonDetails?.course_type,
                  reaccred: resourcePacksPricingCommonDetails?.reaccred,
                })}
              </Typography>
            </Typography>
          ) : null}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Table>
          <TableHead data-testid="table-head">
            <TableRow>
              <TableCell>
                {t('pages.course-pricing.cols-administrator')}
              </TableCell>
              <TableCell>{t('pages.course-pricing.cols-event-date')}</TableCell>
              <TableCell>
                {t(
                  'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-table.columns.resource-pack-option',
                )}
              </TableCell>
              <TableCell>{t('pages.course-pricing.cols-event')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="table-body">
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
              noRecords={!loading && !changelogs.length}
              itemsName={t(
                'pages.course-pricing.modal-changelog-title',
              ).toLowerCase()}
              colSpan={3}
            />
            {changelogs.map(changelog => {
              return (
                <TableRow key={changelog.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {changelog.actioned_by_profile ? (
                        <ProfileAvatar
                          profile={changelog.actioned_by_profile}
                        />
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {t('dates.withTime', { date: changelog.actioned_at })}
                  </TableCell>
                  <TableCell>
                    {t(
                      `pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-table.resource_packs_types.${
                        changelog.resource_packs_pricing?.course_type
                      }.${
                        changelog.resource_packs_pricing?.resource_packs_type
                      }${
                        changelog.resource_packs_pricing?.course_type ===
                          Course_Type_Enum.Indirect &&
                        changelog.resource_packs_pricing
                          ?.resource_packs_type !==
                          Resource_Packs_Type_Enum.DigitalWorkbook
                          ? '.' +
                            changelog.resource_packs_pricing
                              ?.resource_packs_delivery_type
                          : ''
                      }`,
                    )}
                  </TableCell>
                  <TableCell>
                    {getOrgResourcePacksPricingChangeEvent(
                      changelog.updated_columns,
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {totalCount ? (
          <TablePagination
            component="div"
            count={totalCount}
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
      </Container>
    </Dialog>
  )
}
