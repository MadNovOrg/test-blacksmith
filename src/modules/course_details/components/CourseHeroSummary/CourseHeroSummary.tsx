import { Wrapper } from '@googlemaps/react-wrapper'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { pick } from 'lodash'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Status_Enum,
  Venue,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'
import { DeleteCourseModal } from '@app/modules/course/components/DeleteCourseModal'
import { CourseInstructionsDialog } from '@app/modules/course_details/components/CourseInstructionsDialog'
import { AdminOnlyCourseStatus, Course } from '@app/types'
import {
  getCourseBeginsForMessage,
  formatCourseVenue,
  courseEnded,
  UKTimezone,
} from '@app/util'

import {
  AttendeeCourseStatus,
  AttendeeCourse,
} from '../../course_attendees_tab/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { CourseHostInfo } from '../CourseHostInfo'
import { CourseTrainersInfo } from '../CourseTrainersInfo'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

interface Props {
  course: Course
  slots?: Partial<{
    BackButton: React.Factory<unknown>
    EditButton: React.Factory<unknown>
    OrderItem: React.Factory<unknown>
  }>
  isManaged?: boolean
}

export const CourseHeroSummary: React.FC<React.PropsWithChildren<Props>> = ({
  course,
  slots,
  isManaged = false,
}) => {
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country',
  )

  const isResidingCountryEnabled = useMemo(
    () => residingCountryEnabled,
    [residingCountryEnabled],
  )
  const { t } = useTranslation()

  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] =
    useState(false)

  const { acl } = useAuth()

  const [openDeleteCourseDialog, setOpenDeleteCourseDialog] =
    useState<boolean>(false)

  const onCloseDeleteCourseDialog = useCallback(
    () => setOpenDeleteCourseDialog(false),
    [],
  )

  const courseCancelled =
    course &&
    (course.status === Course_Status_Enum.Cancelled ||
      course.status === Course_Status_Enum.Declined)

  const courseContactsData = useMemo(() => {
    const bookingContact = course.bookingContact
      ? pick(course.bookingContact, ['id', 'email', 'fullName'])
      : course.bookingContactInviteData
      ? {
          id: null,
          email: course.bookingContactInviteData.email,
          fullName: `${course.bookingContactInviteData.firstName} ${course.bookingContactInviteData.lastName} `,
        }
      : undefined

    const organisationKeyContact = course.organizationKeyContact
      ? pick(course.organizationKeyContact, ['id', 'email', 'fullName'])
      : course.organizationKeyContactInviteData
      ? {
          id: null,
          email: course.organizationKeyContactInviteData.email,
          fullName: `${course.organizationKeyContactInviteData.firstName} ${course.organizationKeyContactInviteData.lastName} `,
        }
      : undefined

    return { bookingContact, organisationKeyContact }
  }, [
    course.bookingContact,
    course.bookingContactInviteData,
    course.organizationKeyContact,
    course.organizationKeyContactInviteData,
  ])

  const canReInviteTrainers = useMemo(
    () =>
      course &&
      acl.canEditCourses(course) &&
      !courseEnded(course) &&
      !courseCancelled,
    [acl, course, courseCancelled],
  )

  const timeZoneSchedule = useMemo(
    () => ({
      start: utcToZonedTime(
        new Date(course.schedule[0].start),
        course.schedule[0].timeZone ?? 'Europe/London',
      ),
      end: utcToZonedTime(
        new Date(course.schedule[0].end),
        course.schedule[0].timeZone ?? 'Europe/London',
      ),
    }),
    [course.schedule],
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const courseBeginsForMessage = getCourseBeginsForMessage(course, t)

  const backgroundList = isMobile
    ? { backgroundColor: 'white', borderRadius: 3, p: 2 }
    : {}

  const geoCoordinates = useMemo(() => {
    const coordinates = course.schedule[0].venue?.geoCoordinates
      ?.replace(/[()]/g, '')
      .split(',')

    const zeroCoordinate = parseFloat('0')

    if (
      coordinates !== null &&
      coordinates !== undefined &&
      Array.isArray(coordinates) &&
      coordinates.every(element => typeof element === 'string')
    ) {
      const latitude = parseFloat(coordinates[0])
      const longitude = parseFloat(coordinates[1])
      return {
        lat: isNaN(latitude) ? zeroCoordinate : latitude,
        lng: isNaN(longitude) ? zeroCoordinate : longitude,
      }
    } else {
      return {
        lat: zeroCoordinate,
        lng: zeroCoordinate,
      }
    }
  }, [course.schedule])

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        new window.google.maps.Map(node, {
          center: {
            lat: geoCoordinates.lat,
            lng: geoCoordinates.lng,
          },
          zoom: 16,
        })
      }
    },
    [geoCoordinates],
  )

  return (
    <Box
      data-testid="course-hero-summary"
      sx={{
        backgroundColor: theme.palette.grey[100],
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <Container>
        {isMobile ? (
          <>
            <SnackbarMessage
              messageKey="course-created"
              sx={{ position: 'absolute' }}
            />
            <SnackbarMessage
              messageKey="course-canceled"
              severity="info"
              sx={{ position: 'absolute' }}
            />
            <SnackbarMessage
              messageKey="course-submitted"
              sx={{ position: 'absolute' }}
            />
            <SnackbarMessage
              messageKey="course-evaluated"
              sx={{ position: 'absolute' }}
            />
            <SnackbarMessage
              messageKey="participant-transferred"
              sx={{ position: 'absolute' }}
            />
          </>
        ) : undefined}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {slots?.BackButton?.()}
            <Typography
              variant="h3"
              marginBottom={3}
              marginTop={1}
              fontWeight={600}
              data-testid="course-name"
            >
              {course.name}
            </Typography>
            <Typography
              data-testid="course-code"
              variant="body2"
              color="secondary"
            >
              {course.course_code}
            </Typography>
            {/* TODO: Delete this after Arlo migration */}
            {acl.isInternalUser() && course.arloReferenceId ? (
              <>
                <Typography variant="body2" color="secondary">
                  Arlo reference:
                </Typography>
                <Typography
                  variant="body2"
                  color="secondary"
                  sx={{ overflowWrap: 'break-word' }}
                >
                  {course.arloReferenceId}
                </Typography>
              </>
            ) : null}
            {course.status ? (
              <Box mt={2}>
                {acl.isInternalUser() || acl.isTrainer() ? (
                  <CourseStatusChip
                    status={
                      course.cancellationRequest
                        ? AdminOnlyCourseStatus.CancellationRequested
                        : course.status
                    }
                  />
                ) : isManaged ? (
                  <IndividualCourseStatusChip
                    course={{
                      ...course,
                      schedule: [
                        {
                          ...course.schedule[0],
                          timeZone: course.schedule[0].timeZone ?? UKTimezone,
                        },
                      ],
                    }}
                    participants={course.courseParticipants ?? []}
                  />
                ) : (
                  <AttendeeCourseStatus
                    course={course as unknown as AttendeeCourse}
                  />
                )}
              </Box>
            ) : null}
            {isMobile && course.schedule[0].venue?.geoCoordinates ? (
              <Grid>
                <Wrapper
                  apiKey={`${import.meta.env.VITE_GMAPS_KEY}`}
                  libraries={['places', 'visualization']}
                >
                  <Box
                    ref={ref}
                    id="map"
                    sx={{ height: '20vh', width: '100%', mt: 2 }}
                  />
                </Wrapper>
              </Grid>
            ) : undefined}
            <Grid container spacing={1} alignItems={'center'} sx={{ mt: 3 }}>
              {slots?.EditButton ? (
                <Grid item>{slots?.EditButton?.()}</Grid>
              ) : null}

              {acl.canDeleteCourse(course) ? (
                <Grid item>
                  <Button
                    color="error"
                    data-testid="delete-course-button"
                    onClick={() => setOpenDeleteCourseDialog(true)}
                    size="large"
                    startIcon={<DeleteIcon />}
                    variant="contained"
                  >
                    {t('pages.course-participants.delete-course-button')}
                  </Button>
                  {
                    <DeleteCourseModal
                      courseId={course.id}
                      onClose={onCloseDeleteCourseDialog}
                      open={openDeleteCourseDialog}
                    />
                  }
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              fontWeight={500}
              fontSize="0.9rem"
              data-testid="courseBegins-label"
              sx={{
                backgroundColor: theme.palette.grey[300],
                borderRadius: 1,
                paddingLeft: 1,
                paddingRight: 1,
                marginBottom: 2,
                display: 'inline-block',
              }}
            >
              {courseBeginsForMessage}
            </Typography>

            <List dense disablePadding sx={backgroundList}>
              <ListItem disableGutters disablePadding>
                <StyledListIcon>
                  <TodayIcon />
                </StyledListIcon>
                <ListItemText>
                  {t('pages.course-participants.course-beggins')}{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    fontWeight={600}
                    color="secondary"
                    data-testid="startDate-label"
                  >
                    {isResidingCountryEnabled
                      ? `${t('dates.withTime', {
                          date: timeZoneSchedule.start,
                        })} ${formatGMTDateTimeByTimeZone(
                          course.schedule[0].start,
                          course.schedule[0].timeZone,
                          true,
                        )}`
                      : t('dates.withTime', { date: course.schedule[0].start })}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemText sx={{ paddingLeft: 4 }}>
                  {t('pages.course-participants.course-ends')}{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    fontWeight={600}
                    color="secondary"
                    data-testid="endDate-label"
                  >
                    {isResidingCountryEnabled
                      ? `${t('dates.withTime', {
                          date: timeZoneSchedule.end,
                        })} ${formatGMTDateTimeByTimeZone(
                          course.schedule[0].end,
                          course.schedule[0].timeZone,
                          true,
                        )}`
                      : t('dates.withTime', { date: course.schedule[0].end })}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense disablePadding>
              <ListItem
                alignItems={'flex-start'}
                disableGutters
                sx={backgroundList}
              >
                <StyledListIcon>
                  <PersonOutlineIcon />
                </StyledListIcon>
                <List sx={{ paddingTop: 0.5 }}>
                  <CourseTrainersInfo
                    canReInviteTrainer={canReInviteTrainers}
                    courseId={course.id}
                    courseType={course.type}
                    trainers={course.trainers}
                  />
                  {course.organization && (
                    <CourseHostInfo
                      courseType={course.type}
                      organization={course.organization}
                    />
                  )}
                </List>
              </ListItem>

              {courseContactsData.organisationKeyContact ? (
                <ListItem
                  disableGutters
                  sx={{ ...backgroundList, mt: 3, ml: 4 }}
                >
                  <ListItemText>
                    {`${t(
                      'components.course-form.organization-key-contact-label',
                    )}: `}
                    <ListItemText>
                      {acl.isInternalUser() &&
                      courseContactsData.organisationKeyContact.id ? (
                        <Link
                          href={`/profile/${courseContactsData.organisationKeyContact.id}`}
                        >
                          {`${courseContactsData.organisationKeyContact.fullName} `}
                        </Link>
                      ) : (
                        `${courseContactsData.organisationKeyContact.fullName} `
                      )}
                    </ListItemText>
                    <ListItemText>
                      {courseContactsData.organisationKeyContact.email}
                    </ListItemText>
                  </ListItemText>
                </ListItem>
              ) : null}

              {courseContactsData.bookingContact ? (
                <ListItem
                  disableGutters
                  sx={{ ...backgroundList, mt: 3, ml: 4 }}
                >
                  <ListItemText>
                    {`${t('components.course-form.contact-person-label')}: `}
                    <ListItemText>
                      {acl.isInternalUser() &&
                      courseContactsData.bookingContact.id ? (
                        <Link
                          href={`/profile/${courseContactsData.bookingContact?.id}`}
                        >
                          {`${courseContactsData.bookingContact.fullName} `}
                        </Link>
                      ) : (
                        `${courseContactsData.bookingContact.fullName} `
                      )}
                    </ListItemText>
                    <ListItemText>
                      {courseContactsData.bookingContact.email}
                    </ListItemText>
                  </ListItemText>
                </ListItem>
              ) : null}

              <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                <StyledListIcon>
                  <PinDropIcon />
                </StyledListIcon>
                <ListItemText data-testid="course-venue">
                  {formatCourseVenue(
                    course.deliveryType,
                    course.schedule[0].venue as Venue,
                  )}
                </ListItemText>
              </ListItem>

              {course.special_instructions || course.parking_instructions ? (
                <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                  <StyledListIcon>
                    <VisibilityIcon />
                  </StyledListIcon>
                  <ListItemText>
                    <Button
                      variant="text"
                      sx={{ fontSize: '0.875rem' }}
                      disableRipple
                      onClick={() => setIsInstructionsDialogOpen(true)}
                    >
                      {t('components.course-hero-summary.instructions-label')}
                    </Button>
                  </ListItemText>
                </ListItem>
              ) : null}
              {slots?.OrderItem ? (
                <ListItem
                  data-testid="order-item"
                  disableGutters
                  sx={{ ...backgroundList, mt: 3 }}
                >
                  <StyledListIcon>
                    <DescriptionOutlined />
                  </StyledListIcon>
                  <ListItemText>{slots?.OrderItem?.()}</ListItemText>
                </ListItem>
              ) : null}
            </List>
          </Grid>
        </Grid>
      </Container>
      {isInstructionsDialogOpen ? (
        <CourseInstructionsDialog
          open={isInstructionsDialogOpen}
          onCancel={() => setIsInstructionsDialogOpen(false)}
          specialInstructions={course.special_instructions}
          parkingInstructions={course.parking_instructions}
          showParkingInstructions={
            course.deliveryType !== Course_Delivery_Type_Enum.Virtual
          }
        />
      ) : null}
    </Box>
  )
}
