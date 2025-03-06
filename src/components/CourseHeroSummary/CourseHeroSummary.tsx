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
import React, { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Status_Enum,
  Venue,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'
import { CourseInstructionsDialog } from '@app/modules/course_details/components/CourseInstructionsDialog'
import { Course, Profile } from '@app/types'
import {
  getCourseBeginsForMessage,
  formatCourseVenue,
  courseEnded,
} from '@app/util'

import {
  CourseHeroStatusChip,
  DeleteCourseButton,
  MapComponent,
  ProfileLink,
  SnackBars,
  CourseHostInfo,
  CourseTrainersInfo,
} from './Components'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

interface Props {
  course: Course
  slots?: Partial<{
    BackButton: () => ReactNode
    EditButton: () => ReactNode
    OrderItem: () => ReactNode
  }>
  isManaged?: boolean
}

export const CourseHeroSummary: React.FC<React.PropsWithChildren<Props>> = ({
  course,
  slots,
  isManaged = false,
}) => {
  const { t } = useTranslation()

  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] =
    useState(false)

  const { acl } = useAuth()

  const courseCancelled = [
    Course_Status_Enum.Cancelled,
    Course_Status_Enum.Declined,
  ].includes(course.status)

  const courseContactsData = useMemo(() => {
    const getContactData = ({
      contact,
      inviteData,
    }: {
      contact?: Profile
      inviteData:
        | typeof course.bookingContactInviteData
        | typeof course.organizationKeyContactInviteData
    }) => {
      if (contact) {
        return pick(contact, ['id', 'email', 'fullName'])
      }
      if (inviteData) {
        return {
          id: null,
          email: inviteData.email,
          fullName: `${inviteData.firstName} ${inviteData.lastName}`,
        }
      }
      return undefined
    }

    const bookingContact = getContactData({
      contact: course.bookingContact,
      inviteData: course.bookingContactInviteData,
    })
    const organisationKeyContact = getContactData({
      contact: course.organizationKeyContact,
      inviteData: course.organizationKeyContactInviteData,
    })

    return { bookingContact, organisationKeyContact }
  }, [course])

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

  const backgroundList = {
    ...(isMobile && { backgroundColor: 'white', borderRadius: 3, p: 2 }),
  }

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
        <SnackBars />
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
            {acl.isInternalUser() && course.arloReferenceId ? (
              <>
                <Typography variant="body2" color="secondary">
                  {`${acl.isUK() ? 'Arlo' : 'Internal'} reference:`}
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
            <CourseHeroStatusChip isManaged={isManaged} course={course} />
            <MapComponent
              geoCoordinates={course.schedule[0].venue?.geoCoordinates}
            />
            <Grid container spacing={1} alignItems={'center'} sx={{ mt: 3 }}>
              {slots?.EditButton ? (
                <Grid item>{slots?.EditButton?.()}</Grid>
              ) : null}
              <DeleteCourseButton course={course} />
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
                    {`${t('dates.withTime', {
                      date: timeZoneSchedule.start,
                    })} ${formatGMTDateTimeByTimeZone(
                      course.schedule[0].start,
                      course.schedule[0].timeZone,
                      true,
                    )}`}
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
                    {`${t('dates.withTime', {
                      date: timeZoneSchedule.end,
                    })} ${formatGMTDateTimeByTimeZone(
                      course.schedule[0].end,
                      course.schedule[0].timeZone,
                      true,
                    )}`}
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
                      <ProfileLink
                        profileId={
                          courseContactsData.organisationKeyContact.id ?? ''
                        }
                        fullName={
                          courseContactsData.organisationKeyContact.fullName ??
                          ''
                        }
                      />
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
                      <ProfileLink
                        profileId={courseContactsData.bookingContact?.id ?? ''}
                        fullName={
                          courseContactsData.bookingContact.fullName ?? ''
                        }
                      />
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
