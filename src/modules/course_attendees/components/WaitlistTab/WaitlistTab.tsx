import {
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useSnackbar } from '@app/context/snackbar'
import {
  CancelIndividualFromCourseWaitlistMutation,
  CancelIndividualFromCourseWaitlistMutationVariables,
} from '@app/generated/graphql'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { CANCEL_INDIVIDUAL_FROM_COURSE_WAITLIST_MUTATION } from '@app/queries/waitlist/cancel-individual-from-course-waitlist'
import { Course } from '@app/types'

type TabProperties = { course: Course }

export const WaitlistTab = ({ course }: TabProperties) => {
  const { t } = useTranslation()
  const { addSnackbarMessage } = useSnackbar()

  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('createdAt', 'asc')

  const {
    data,
    total,
    isLoading,
    mutate: getWaitlist,
  } = useWaitlist({
    courseId: course.id,
    sort,
    limit,
    offset,
  })

  const [
    {
      data: cancellingFromWaitlistData,
      error: cancellingFromWaitlistError,
      fetching: cancellingFromWaitlist,
    },
    cancelIndividualFromCourseWaitlist,
  ] = useMutation<
    CancelIndividualFromCourseWaitlistMutation,
    CancelIndividualFromCourseWaitlistMutationVariables
  >(CANCEL_INDIVIDUAL_FROM_COURSE_WAITLIST_MUTATION)

  const hasCancellingError = useMemo(() => {
    return (
      cancellingFromWaitlistError ||
      cancellingFromWaitlistData?.cancelIndividualFromCourseWaitlist?.error
    )
  }, [cancellingFromWaitlistData, cancellingFromWaitlistError])

  const cancellationMessage = useMemo(() => {
    if (cancellingFromWaitlistError) {
      return 'errors.generic.unknown-error-please-retry'
    }

    if (cancellingFromWaitlistData?.cancelIndividualFromCourseWaitlist?.error) {
      return 'waitlist-participant-remove-failed'
    }

    return 'waitlist-participant-removed'
  }, [cancellingFromWaitlistData, cancellingFromWaitlistError])

  const handleRemoveIndividual = useCallback(
    async (waitlistId: string) => {
      try {
        await cancelIndividualFromCourseWaitlist({
          courseId: course.id,
          waitlistId: waitlistId,
        })
      } catch (err) {
        console.error(err)
      } finally {
        if (hasCancellingError) {
          addSnackbarMessage('waitlist-participant-remove-failed', {
            label: t(cancellationMessage),
          })
        } else {
          addSnackbarMessage('waitlist-participant-removed', {
            label: t(cancellationMessage),
          })
        }
        getWaitlist()
      }
    },
    [
      addSnackbarMessage,
      cancelIndividualFromCourseWaitlist,
      cancellationMessage,
      course.id,
      getWaitlist,
      hasCancellingError,
      t,
    ]
  )

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.course-details.tabs.waitlist.${col}`)

    return [
      { id: 'givenName', label: _t('name'), sorting: true },
      { id: 'email', label: _t('contact'), sorting: false },
      { id: 'createdAt', label: _t('joined'), sorting: true },
      { id: 'action', label: t('action'), sorting: false },
    ]
  }, [t])

  return (
    <>
      <SnackbarMessage
        messageKey="waitlist-participant-removed"
        sx={{ position: 'absolute' }}
      />
      <SnackbarMessage
        severity="error"
        messageKey="waitlist-participant-remove-failed"
        sx={{ position: 'absolute' }}
      />
      <Table data-testid="waitlist-table">
        <TableHead
          cols={cols}
          orderBy={sort.by}
          order={sort.dir}
          onRequestSort={sort.onSort}
        />
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={cols.length}>
                <Stack direction="row" alignItems="center">
                  <CircularProgress size={20} />
                </Stack>
              </TableCell>
            </TableRow>
          ) : null}

          <TableNoRows
            noRecords={!isLoading && data.length === 0}
            filtered={false}
            itemsName={t(
              'pages.course-details.tabs.waitlist.waitlist'
            ).toLowerCase()}
            colSpan={cols.length}
          />

          {data.map(entry => (
            <TableRow key={entry.id} data-testid={`waitlist-entry-${entry.id}`}>
              <TableCell>{`${entry.givenName} ${entry.familyName}`}</TableCell>
              <TableCell>
                <Stack direction="column" alignItems="left">
                  <Typography variant="body1">{entry.email}</Typography>
                  <Typography variant="body2">{entry.phone}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                {t('dates.default', { date: entry.createdAt })}
              </TableCell>
              <TableCell>
                <Button
                  disabled={cancellingFromWaitlist}
                  onClick={() => {
                    handleRemoveIndividual(entry.id)
                  }}
                >
                  {t('remove')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination total={total} />
    </>
  )
}
