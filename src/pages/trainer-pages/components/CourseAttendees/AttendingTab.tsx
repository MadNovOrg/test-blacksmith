import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  Button,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog } from '@app/components/ConfirmDialog'
import { LinkToProfile } from '@app/components/LinkToProfile'
import {
  Mode,
  ReplaceParticipantDialog,
} from '@app/components/ReplaceParticipantDialog'
import { TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import { RemoveIndividualModal } from '@app/pages/trainer-pages/components/CourseAttendees/RemoveIndividualModal'
import {
  MUTATION as SEND_COURSE_INFO,
  ParamsType as SendCourseInfoParamType,
  ResponseType as SendCourseInfoResponseType,
} from '@app/queries/courses/send-course-information'
import { Matcher } from '@app/queries/participants/get-course-participants'
import {
  BlendedLearningStatus,
  Course,
  CourseParticipant,
  CourseType,
  SortOrder,
} from '@app/types'
import { courseEnded, LoadingStatus } from '@app/util'

import { CourseActionsMenu } from './CourseActionsMenu'

type TabProperties = {
  course: Course
  onSendingCourseInformation: (success: boolean) => void
}

const PER_PAGE = 12
const ROWS_PER_PAGE_OPTIONS = [12, 24, 50, 100]

export const AttendingTab = ({
  course,
  onSendingCourseInformation,
}: TabProperties) => {
  const { isOrgAdmin, acl } = useAuth()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [individualToRemove, setIndividualToRemove] =
    useState<CourseParticipant>()
  const [participantToReplace, setParticipantToReplace] =
    useState<CourseParticipant>()
  const [individualToResendInfo, setIndividualToResendInfo] =
    useState<CourseParticipant>()
  const isBlendedCourse = course.go1Integration
  const isOpenCourse = course.type === CourseType.OPEN
  const isCourseEnded = courseEnded(course)
  const navigate = useNavigate()
  const fetcher = useFetcher()

  const {
    data: courseParticipants,
    status: courseParticipantsLoadingStatus,
    total: courseParticipantsTotal,
  } = useCourseParticipants(course?.id ?? '', {
    sortBy: sortColumn,
    order,
    pagination: {
      limit: perPage,
      offset: perPage * currentPage,
    },
    alwaysShowArchived: true,
  })

  const matchMutate = useMatchMutate()

  const invalidateCache = useCallback(() => matchMutate(Matcher), [matchMutate])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  const handleSortChange = useCallback(
    (columnName: string) => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn]
  )

  const cols = useMemo(
    () =>
      [
        {
          id: 'name',
          label: t('pages.course-participants.name'),
          sorting: true,
        },
        {
          id: 'email',
          label: t('common.email'),
          sorting: true,
        },
        {
          id: 'organisation',
          label: t('pages.course-participants.organisation'),
          sorting: false,
        },
        isBlendedCourse
          ? {
              id: 'bl-status',
              label: t('bl-status'),
              sorting: true,
            }
          : null,
        {
          id: 'hs-consent',
          label: t('pages.course-participants.hs-consent'),
          sorting: false,
        },
        isOpenCourse && acl.canViewOrders()
          ? {
              id: 'orders',
              label: t('pages.course-participants.orders'),
              sorting: false,
            }
          : null,
        !isCourseEnded &&
        acl.canManageParticipantAttendance(
          courseParticipants?.reduce(
            (acc, courseParticipant) => [
              ...acc,
              ...courseParticipant.profile.organizations.map(
                org => org.organization.id
              ),
            ],
            [] as string[]
          ) ?? [],
          course.accreditedBy
        )
          ? {
              id: 'actions',
              label: t('pages.course-participants.actions'),
              sorting: false,
            }
          : null,
      ].filter(Boolean),
    [
      t,
      isBlendedCourse,
      isOpenCourse,
      acl,
      isCourseEnded,
      courseParticipants,
      course.accreditedBy,
    ]
  )

  const handleTransfer = useCallback(
    (id: string) => {
      navigate(`../transfer/${id}`, { replace: true })
    },
    [navigate]
  )

  const sendCourseInfo = useCallback(
    async (
      courseId: SendCourseInfoParamType['courseId'],
      attendeeIds: SendCourseInfoParamType['attendeeIds']
    ) => {
      setIndividualToResendInfo(undefined)
      try {
        const response = await fetcher<
          SendCourseInfoResponseType,
          SendCourseInfoParamType
        >(SEND_COURSE_INFO, { courseId, attendeeIds })

        if (response?.sendCourseInformation.success) {
          onSendingCourseInformation(true)
        } else {
          console.log('Error! ', response?.sendCourseInformation)
          onSendingCourseInformation(false)
        }
      } catch (err) {
        onSendingCourseInformation(false)
      }
    },
    [fetcher, onSendingCourseInformation]
  )

  return (
    <>
      {courseParticipantsLoadingStatus === LoadingStatus.SUCCESS &&
      courseParticipants?.length ? (
        <>
          <Box sx={{ overflowX: 'auto' }}>
            <Table data-testid="attending-table">
              <TableHead
                cols={cols}
                order={order}
                orderBy={sortColumn}
                onRequestSort={handleSortChange}
              />
              <TableBody>
                {courseParticipants?.map(courseParticipant => {
                  const participantOrgIds =
                    courseParticipant.profile.organizations.map(
                      org => org.organization.id
                    )
                  return (
                    <TableRow
                      key={courseParticipant.id}
                      data-testid={`course-participant-row-${courseParticipant.id}`}
                    >
                      <TableCell>
                        <LinkToProfile
                          profileId={courseParticipant.profile.id}
                          isProfileArchived={courseParticipant.profile.archived}
                        >
                          {courseParticipant.profile.archived
                            ? t('common.archived-profile')
                            : courseParticipant.profile.fullName}
                        </LinkToProfile>
                      </TableCell>
                      <TableCell>
                        <LinkToProfile
                          profileId={courseParticipant.profile.id}
                          isProfileArchived={courseParticipant.profile.archived}
                        >
                          {courseParticipant.profile.email}
                          {courseParticipant.profile.contactDetails.map(
                            contact => contact.value
                          )}
                        </LinkToProfile>
                      </TableCell>
                      <TableCell>
                        {courseParticipant.profile.organizations.map(org => (
                          <Link
                            href={`/organisations/${org.organization.id}`}
                            key={org.organization.id}
                          >
                            <Typography>{org.organization.name}</Typography>
                          </Link>
                        ))}
                      </TableCell>
                      {isBlendedCourse && (
                        <TableCell>
                          {courseParticipant.go1EnrolmentStatus && (
                            <Chip
                              label={t(
                                `blended-learning-status.${courseParticipant.go1EnrolmentStatus}`
                              )}
                              color={
                                courseParticipant.go1EnrolmentStatus ===
                                BlendedLearningStatus.COMPLETED
                                  ? 'success'
                                  : 'warning'
                              }
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {courseParticipant.healthSafetyConsent
                          ? t('common.yes')
                          : t('common.no')}
                      </TableCell>
                      {isOpenCourse && acl.canViewOrders() ? (
                        <TableCell>
                          {courseParticipant.order ? (
                            <Link
                              href={`/orders/${courseParticipant.order.id}`}
                              data-testid="order-item-link"
                              key="order-item-link"
                              color="Highlight"
                              fontWeight="600"
                            >
                              {courseParticipant.order.xeroInvoiceNumber}
                            </Link>
                          ) : (
                            <Typography
                              color="InactiveCaption"
                              style={{ userSelect: 'none' }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                      ) : null}
                      {!isCourseEnded &&
                      acl.canManageParticipantAttendance(
                        participantOrgIds,
                        course.accreditedBy
                      ) &&
                      !courseParticipant.profile.archived ? (
                        <TableCell>
                          {!isOpenCourse ||
                          acl.canOnlySendCourseInformation(
                            participantOrgIds,
                            course.accreditedBy
                          ) ? (
                            <Button
                              startIcon={
                                <SendIcon color="primary" titleAccess="Send" />
                              }
                              onClick={() =>
                                setIndividualToResendInfo(courseParticipant)
                              }
                            >
                              {t('common.resend-course-information')}
                            </Button>
                          ) : (
                            <CourseActionsMenu
                              item={courseParticipant}
                              data-testid="manage-attendance"
                              onReplaceClick={participant => {
                                setParticipantToReplace(participant)
                              }}
                              onRemoveClick={participant => {
                                setIndividualToRemove(participant)
                              }}
                              onTransferClick={participant => {
                                handleTransfer(participant.id)
                              }}
                              onResendCourseInformationClick={participant =>
                                setIndividualToResendInfo(participant)
                              }
                            />
                          )}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
          {courseParticipantsTotal ? (
            <TablePagination
              component="div"
              count={courseParticipantsTotal}
              page={currentPage}
              onPageChange={(_, page) => setCurrentPage(page)}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={perPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              data-testid="course-participants-pagination"
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

          {individualToRemove ? (
            <RemoveIndividualModal
              participant={individualToRemove}
              course={course}
              onClose={() => setIndividualToRemove(undefined)}
              onSave={invalidateCache}
            />
          ) : null}

          {participantToReplace ? (
            <ReplaceParticipantDialog
              course={course}
              participant={{
                id: participantToReplace.id,
                fullName: participantToReplace.profile.fullName,
                avatar: participantToReplace.profile.avatar,
              }}
              onClose={() => setParticipantToReplace(undefined)}
              onSuccess={invalidateCache}
              mode={isOrgAdmin ? Mode.ORG_ADMIN : Mode.TT_ADMIN}
            />
          ) : null}

          {individualToResendInfo ? (
            <ConfirmDialog
              open={Boolean(individualToResendInfo)}
              title={t(
                'pages.course-participants.resend-course-info.modal.title'
              )}
              message={t(
                'pages.course-participants.resend-course-info.modal.message',
                { fullName: individualToResendInfo?.profile.fullName }
              )}
              onCancel={() => setIndividualToResendInfo(undefined)}
              onOk={() =>
                sendCourseInfo(course.id, [individualToResendInfo?.id])
              }
            />
          ) : null}
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={4}
          data-testid="course-participants-zero-message"
        >
          <Typography variant="body1" color="grey.600">
            {course?.type === CourseType.OPEN
              ? t('pages.course-participants.no-attendees')
              : t('pages.course-participants.none-registered-message')}
          </Typography>
        </Box>
      )}
    </>
  )
}
