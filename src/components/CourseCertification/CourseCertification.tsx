import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  Alert,
  Avatar,
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
import { format } from 'date-fns'
import MUIImage from 'mui-image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import {
  CertificateAssistIcon,
  CertificateObserveIcon,
  CertificatePassIcon,
  cpdImage,
  icmImage,
  ntaImage,
} from '@app/assets'
import { CertificateDocument } from '@app/components/CertificatePDF'
import ChangelogModal from '@app/components/CourseCertification/ChangelogModal'
import ModifyGradeModal from '@app/components/CourseCertification/ModifyGradeModal'
import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  ParamsType as GetCertificateChangelogsParamsType,
  QUERY as GetCertificateChangelogsQuery,
  ResponseType as GetCertificateChangelogsResponseType,
} from '@app/queries/grading/get-certificate-changelog'
import theme from '@app/theme'
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
          <Grid container spacing={2} mt={4}>
            <Grid item xs={4} sx={{ color: 'grey.500' }}>
              <Typography variant="body2">
                {t('common.course-certificate.issue-date')}
              </Typography>
            </Grid>

            <Grid item xs={4} sx={{ color: 'grey.500' }}>
              <Typography variant="body2">
                {t('common.course-certificate.number')}
              </Typography>
            </Grid>

            <Grid item xs={4} sx={{ color: 'grey.500' }}>
              <Typography variant="body2">
                {t('common.course-certificate.valid-until')}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                {format(new Date(dateIssued), 'd MMMM yyyy')}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="caption">{certificationNumber}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2">
                {format(new Date(expiryDate), 'd MMMM yyyy')}
              </Typography>
            </Grid>
          </Grid>

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
  const { acl } = useAuth()
  const [showModifyGradeModal, setShowModifyGradeModal] = useState(false)
  const [showChangelogModal, setShowChangelogModal] = useState(false)

  const { data: changeLogsData } = useSWR<
    GetCertificateChangelogsResponseType,
    Error,
    [string, GetCertificateChangelogsParamsType]
  >([GetCertificateChangelogsQuery, { participantId: courseParticipant.id }])

  const certificationNumber = courseParticipant.certificate?.number ?? ''
  const grade = courseParticipant?.grade

  if (!courseParticipant?.grade || !courseParticipant.dateGraded) {
    return (
      <Container sx={{ py: 2 }}>
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

  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item md={3} px={4}>
            <Grid container gap={2}>
              <Box sx={{ mb: 2 }} mx="auto">
                {grade ? gradesToCertificateIconMapping[grade] : null}
              </Box>

              {acl.canOverrideGrades() ? (
                <Box mb={3}>
                  <Typography color={theme.palette.grey[700]} fontWeight={600}>
                    {t('common.attendee')}
                  </Typography>

                  <Box
                    pt={1}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1}
                  >
                    <Avatar />
                    <Typography variant="body1">
                      {courseParticipant.profile.fullName}
                    </Typography>
                  </Box>
                </Box>
              ) : null}

              {grade !== Grade.FAIL ? (
                <Button
                  fullWidth
                  data-testid="download-certificate-button"
                  size="large"
                  variant="contained"
                  color="primary"
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
                        expiryDate={
                          courseParticipant.certificate?.expiryDate ?? ''
                        }
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

              {acl.canOverrideGrades() ? (
                <Box mt={2}>
                  <Button
                    fullWidth
                    data-testid="modify-grade-button"
                    size="large"
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowModifyGradeModal(true)}
                  >
                    {t('common.course-certificate.modify-grade')}
                  </Button>
                  {changeLogsData?.changelogs.length ? (
                    <Button
                      fullWidth
                      data-testid="change-log-button"
                      size="large"
                      variant="text"
                      color="primary"
                      onClick={() => setShowChangelogModal(true)}
                    >
                      {t('common.course-certificate.change-log')}
                    </Button>
                  ) : null}
                </Box>
              ) : null}
            </Grid>
          </Grid>

          <Grid item md={7}>
            <CertificateInfo
              course={course}
              grade={grade as Grade}
              courseParticipant={courseParticipant}
              expiryDate={courseParticipant.certificate?.expiryDate ?? ''}
              certificationNumber={certificationNumber}
              dateIssued={dateIssued.toISOString()}
            />
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showModifyGradeModal}
        onClose={() => setShowModifyGradeModal(false)}
        title={t('common.course-certificate.modify-grade')}
        maxWidth={800}
      >
        <ModifyGradeModal
          participant={courseParticipant}
          onClose={() => setShowModifyGradeModal(false)}
        />
      </Dialog>

      <Dialog
        open={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        title={t('common.course-certificate.change-log')}
        maxWidth={800}
      >
        {changeLogsData?.changelogs.length ? (
          <ChangelogModal changelogs={changeLogsData?.changelogs} />
        ) : null}
      </Dialog>
    </Box>
  )
}
