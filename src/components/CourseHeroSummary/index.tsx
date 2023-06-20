import { Info } from '@mui/icons-material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PinDropIcon from '@mui/icons-material/PinDrop'
import TodayIcon from '@mui/icons-material/Today'
import VideocamIcon from '@mui/icons-material/Videocam'
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import GoogleMapReact from 'google-map-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseInstructionsDialog } from '@app/components/CourseInstructionsDialog'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { Course_Status_Enum } from '@app/generated/graphql'
import { Course, CourseDeliveryType } from '@app/types'
import { getCourseBeginsForMessage, formatCourseVenue } from '@app/util'

import { CourseHostInfo } from '../CourseHostInfo'
import { CourseTrainersInfo } from '../CourseTrainersInfo'

const StyledListIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '32px',
  color: theme.palette.secondary.main,
}))

interface Props {
  course: Course
  renderButton?: () => React.ReactNode
}

export const CourseHeroSummary: React.FC<React.PropsWithChildren<Props>> = ({
  course,
  children,
  renderButton,
}) => {
  const { t } = useTranslation()
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] =
    useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const courseBeginsForMessage = getCourseBeginsForMessage(course, t)

  const showStatus =
    course.status === Course_Status_Enum.Cancelled ||
    course.status === Course_Status_Enum.Declined

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

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <Container>
        <Grid container spacing={3}>
          {isMobile && course.schedule[0].venue?.geoCoordinates ? (
            <Grid>
              <Box sx={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: `${import.meta.env.VITE_GMAPS_KEY}`,
                  }}
                  defaultCenter={{
                    lat: geoCoordinates.lat ?? 0,
                    lng: geoCoordinates.lng ?? 0,
                  }}
                  defaultZoom={11}
                />
              </Box>
            </Grid>
          ) : undefined}
          <Grid item xs={12} md={4}>
            {children}
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
            {showStatus ? (
              <Box mt={1}>
                <CourseStatusChip status={course.status} />
              </Box>
            ) : null}
            {typeof renderButton === 'function' && renderButton()}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              fontWeight={500}
              fontSize="0.9rem"
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
                <ListItemText>
                  {formatCourseVenue(
                    course.deliveryType,
                    course.schedule[0].venue
                  )}
                </ListItemText>
              </ListItem>
              {course.schedule[0].virtualLink ? (
                <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                  <StyledListIcon>
                    <VideocamIcon />
                  </StyledListIcon>
                  <ListItemText>
                    <Button
                      href={course.schedule[0].virtualLink}
                      component="a"
                      target="_blank"
                    >
                      {t('common.join-zoom')}
                    </Button>
                  </ListItemText>
                </ListItem>
              ) : null}
              {course.notes ? (
                <ListItem disableGutters sx={{ ...backgroundList, mt: 3 }}>
                  <StyledListIcon>
                    <Info />
                  </StyledListIcon>
                  <ListItemText>
                    <Tooltip title={course.notes}>
                      <Typography
                        component="span"
                        data-testid="additional-notes-label"
                        variant="body2"
                      >
                        {t('components.course-hero-summary.notes-label')}
                      </Typography>
                    </Tooltip>
                  </ListItemText>
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
