import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import pdf from '@react-pdf/renderer'
import { add, format } from 'date-fns'
import MUIImage from 'mui-image'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  CertificateAssistIcon,
  CertificateObserveIcon,
  CertificatePassIcon,
  cpdImage,
  icmImage,
  ntaImage,
} from '@app/assets'
import { CertificateDocument } from '@app/components/CertificatePDF'
import { Course, CourseParticipant, Grade } from '@app/types'
import { transformModulesToGroups } from '@app/util'

// workaround for using recat-pdf with vite
const { PDFDownloadLink } = pdf

type ModuleObject = {
  name: string
  completed: boolean
}

const gradesToCertificateIconMapping = {
  PASS: <CertificatePassIcon width={200} height={200} />,
  OBSERVE_ONLY: <CertificateObserveIcon width={200} height={200} />,
  ASSIST_ONLY: <CertificateAssistIcon width={200} height={200} />,
  FAIL: null,
}

type UncompletedListProps = {
  uncompletedModules: ModuleObject[]
}

const UncompletedList: React.FC<UncompletedListProps> = ({
  uncompletedModules,
}) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Typography variant="body2" color="grey.500" gutterBottom>
        {t('common.course-certificate.incomplete')}
      </Typography>
      {uncompletedModules.map(module => {
        return (
          <Typography
            key={module.name}
            color="grey.500"
            variant="body1"
            gutterBottom
          >
            {module.name}
          </Typography>
        )
      })}
    </Box>
  )
}

const validUntilMonthsByCourseLevel = {
  LEVEL_1: 36,
  LEVEL_2: 24,
  ADVANCED: 12,
  BILD_ACT: 12,
  INTERMEDIATE: 12,
}

type ModuleGroupAccordionProps = {
  moduleGroupName: string
  completedModules: ModuleObject[]
  uncompletedModules: ModuleObject[]
}

const ModuleGroupAccordion: React.FC<ModuleGroupAccordionProps> = ({
  moduleGroupName,
  completedModules,
  uncompletedModules,
}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const totalModules = completedModules.length + uncompletedModules.length

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            variant="subtitle2"
            sx={{ width: { sm: '60%', md: '70%' }, flexShrink: 0, mt: -0.5 }}
          >
            {moduleGroupName}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {`${completedModules.length} of ${totalModules} completed`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {completedModules.map(module => (
            <Typography key={module.name} variant="body1" gutterBottom>
              {module.name}
            </Typography>
          ))}
          {uncompletedModules.length ? (
            <UncompletedList uncompletedModules={uncompletedModules} />
          ) : null}
        </AccordionDetails>
      </Accordion>
      <Divider />
    </>
  )
}

type CertificateInfoProps = {
  course: Course
  courseParticipant: CourseParticipant
  grade: Grade
  expiryDate: string
  certificationNumber: string
  dateIssued: string
}

const CertificateInfo: React.FC<CertificateInfoProps> = ({
  course,
  courseParticipant,
  grade,
  expiryDate,
  certificationNumber,
  dateIssued,
}) => {
  const imageSize = '10%'
  const { t } = useTranslation()

  const moduleGroupsWithModules = transformModulesToGroups(
    courseParticipant.gradingModules
  )

  return (
    <Box>
      <Typography color="grey.500" variant="subtitle2" sx={{ mb: 2 }}>
        {t('common.course-certificate.certified-message')}
      </Typography>

      <Typography variant="h2" gutterBottom>
        {t(`common.course-certificate.${grade.toLowerCase()}-title`)}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {course?.name}
      </Typography>

      {grade !== Grade.FAIL ? (
        <>
          <Box
            sx={{
              gap: { sm: 2, md: 6 },
              mt: 6,
              color: 'grey.500',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Typography variant="body2" gutterBottom>
              {t('common.course-certificate.issue-date')}
            </Typography>

            <Typography variant="body2" gutterBottom sx={{ ml: { md: 2 } }}>
              {t('common.course-certificate.number')}
            </Typography>

            <Typography variant="body2" gutterBottom sx={{ ml: 15 }}>
              {t('common.course-certificate.valid-until')}
            </Typography>
          </Box>

          <Box
            sx={{
              gap: { sm: 2, md: 6 },
              mt: 1,
              position: 'relative',
              display: 'flex',
            }}
          >
            <Typography variant="body2" gutterBottom>
              {format(new Date(dateIssued), 'd MMMM yyyy')}
            </Typography>

            <Typography
              variant="caption"
              gutterBottom
              sx={{ maxWidth: '50%', ml: { md: -2.5 } }}
            >
              {certificationNumber}
            </Typography>

            <Typography
              variant="body2"
              gutterBottom
              sx={{ ml: { sm: 10, md: 2 } }}
            >
              {format(new Date(expiryDate), 'd MMMM yyyy')}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 6,
              gap: 6,
              display: 'flex',
              mb: 9,
            }}
          >
            <MUIImage src={icmImage} width={imageSize} height={imageSize} />
            <MUIImage
              src={cpdImage}
              width={imageSize}
              height={imageSize}
              sx={{ mt: 2 }}
            />
            <MUIImage
              src={ntaImage}
              width={imageSize}
              height={imageSize}
              sx={{ mt: 2 }}
            />
          </Box>
        </>
      ) : null}

      <Typography variant="h3" gutterBottom>
        {t('common.course-certificate.modules-list-title')}
      </Typography>

      {moduleGroupsWithModules.map(moduleGroupWithModules => {
        return (
          <ModuleGroupAccordion
            key={moduleGroupWithModules.id}
            moduleGroupName={moduleGroupWithModules.name}
            completedModules={moduleGroupWithModules.modules.filter(
              module => module.completed
            )}
            uncompletedModules={moduleGroupWithModules.modules.filter(
              module => !module.completed
            )}
          />
        )
      })}
    </Box>
  )
}

type CourseCertificationProps = {
  course: Course
  courseParticipant: CourseParticipant
}

export const CourseCertification: React.FC<CourseCertificationProps> = ({
  course,
  courseParticipant,
}) => {
  const { t } = useTranslation()

  const certificationNumber = courseParticipant.certificate?.number ?? ''
  const grade = courseParticipant?.grade

  if (!courseParticipant?.grade || !courseParticipant.dateGraded) {
    return (
      <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <Alert variant="outlined" color="warning">
          {t('common.course-certificate.not-graded-yet')}
        </Alert>
      </Container>
    )
  }

  const dateIssued = courseParticipant.dateGraded
    ? new Date(courseParticipant.dateGraded)
    : new Date(0)
  const courseDeliveryType = course.deliveryType

  const expiryDate = add(dateIssued, {
    months: validUntilMonthsByCourseLevel[course.level],
  }).toISOString()

  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item md={3}>
            <Box sx={{ mb: 2 }}>
              {grade ? gradesToCertificateIconMapping[grade] : null}
            </Box>
            {grade !== Grade.FAIL ? (
              <Button
                data-testid="download-certificate-button"
                size="large"
                variant="contained"
                color="primary"
                sx={{
                  mb: {
                    sm: 10,
                  },
                }}
              >
                <PDFDownloadLink
                  style={{ color: 'white' }}
                  document={
                    <CertificateDocument
                      participantName={courseParticipant.profile?.fullName}
                      courseName={course.name}
                      courseLevel={course.level}
                      grade={grade as Grade}
                      courseDeliveryType={courseDeliveryType}
                      certificationNumber={certificationNumber}
                      expiryDate={expiryDate}
                    />
                  }
                  fileName="certificate.pdf"
                >
                  {({ loading, error }) =>
                    loading
                      ? t('common.course-certificate.cert-loading')
                      : error
                      ? t('common.course-certificate.cert-error')
                      : t('common.course-certificate.download-certificate')
                  }
                </PDFDownloadLink>
              </Button>
            ) : null}
          </Grid>

          <Grid item md={7}>
            <CertificateInfo
              course={course}
              grade={grade as Grade}
              courseParticipant={courseParticipant}
              expiryDate={expiryDate}
              certificationNumber={certificationNumber}
              dateIssued={dateIssued.toISOString()}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
