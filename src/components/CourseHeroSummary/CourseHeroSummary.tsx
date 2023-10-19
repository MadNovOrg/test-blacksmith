import { Wrapper } from '@googlemaps/react-wrapper'
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
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AttendeeCourse,
  AttendeeCourseStatus,
} from '@app/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { CourseInstructionsDialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { AdminOnlyCourseStatus, Course, CourseDeliveryType } from '@app/types'
import { getCourseBeginsForMessage, formatCourseVenue } from '@app/util'

import { CourseHostInfo } from '../CourseHostInfo'
import { CourseTrainersInfo } from '../CourseTrainersInfo'
import { SnackbarMessage } from '../SnackbarMessage'

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
}

export const CourseHeroSummary: React.FC<React.PropsWithChildren<Props>> = ({
  course,
  slots,
}) => {
  const { t } = useTranslation()
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] =
    useState(false)

  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const courseBeginsForMessage = getCourseBeginsForMessage(course, t)

  const backgroundList = isMobile
    ? { backgroundColor: 'white', borderRadius: 3, p: 2 }
    : {}

  const geoCoordinates = useMemo(() => {
    const coordinates = course.schedule[0].venue?.geoCoordinates
      .replace(/[()]/g, '')
      .split(',')

    return {
      lat: parseFloat(coordinates?.at(0) ?? '0'),
      lng: parseFloat(coordinates?.at(1) ?? '0'),
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
    [geoCoordinates]
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
            <Typography variant="body2" color="secondary">
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
                {!acl.isUser() ? (
                  <CourseStatusChip
                    status={
                      course.cancellationRequest
                        ? AdminOnlyCourseStatus.CancellationRequested
                        : course.status
                    }
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
            {slots?.EditButton?.()}
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
                    {t('dates.withTime', { date: course.schedule[0].start })}
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
                    {t('dates.withTime', { date: course.schedule[0].end })}
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
                  <CourseTrainersInfo trainers={course.trainers} />
                  {course.organization && (
                    <CourseHostInfo
                      courseType={course.type}
                      organization={course.organization}
                    />
                  )}
                </List>
              </ListItem>
              <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                <StyledListIcon>
                  <PinDropIcon />
                </StyledListIcon>
                <ListItemText data-testid="course-venue">
                  {formatCourseVenue(
                    course.deliveryType,
                    course.schedule[0].venue
                  )}
                </ListItemText>
              </ListItem>
              {course.organizationKeyContact?.email ? (
                <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                  <ListItemText>{`${t(
                    'components.course-form.organization-key-contact-label'
                  )}: ${course.organizationKeyContact?.email}`}</ListItemText>
                </ListItem>
              ) : null}

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
            course.deliveryType !== CourseDeliveryType.VIRTUAL
          }
        />
      ) : null}
    </Box>
  )
}
