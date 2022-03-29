import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  Alert,
  Box,
  Container,
  Grid,
  Button,
  Typography,
} from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import MUIImage from 'mui-image'
import { add, differenceInHours, format } from 'date-fns'
import pdf from '@react-pdf/renderer'

import { ReactComponent as CertificateAssistIcon } from './certificate-assist.svg'
import { ReactComponent as CertificateObserveIcon } from './certificate-observe.svg'
import { ReactComponent as CertificatePassIcon } from './certificate-pass.svg'
import icmImage from './icm.png'
import cpdImage from './cpd.png'
import ntaImage from './nta.png'
import BILDOutlineImage from './outline_bild.jpg'
import ICMOutlineImage from './outline_icm.jpg'

import {
  Course,
  CourseDeliveryType,
  CourseLevel,
  CourseParticipant,
  Grade,
} from '@app/types'

type ModuleObject = {
  name: string
  completed: boolean
}

type ModuleGroup = {
  id: string
  name: string
}

const { PDFDownloadLink, Document, Image, Page, StyleSheet, Text } = pdf

const gradesToCertificateIconMapping = {
  PASS: <CertificatePassIcon width={200} height={200} />,
  OBSERVE_ONLY: <CertificateAssistIcon width={200} height={200} />,
  ASSIST_ONLY: <CertificateObserveIcon width={200} height={200} />,
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

type ModuleNamesGroupedByModuleGroupMapping = Record<string, ModuleObject[]>

const getModuleData = (
  courseParticipant: CourseParticipant
): [ModuleGroup[], ModuleNamesGroupedByModuleGroupMapping] => {
  const moduleGroupIdsToNames: Record<string, string> = {}
  for (const grading of courseParticipant.gradingModules) {
    moduleGroupIdsToNames[grading.module.moduleGroup.id] =
      grading.module.moduleGroup.name
  }

  const countedModuleGroupIds: Record<string, boolean> = {}
  const moduleGroups: ModuleGroup[] = []

  if (courseParticipant?.gradingModules) {
    for (const grading of courseParticipant.gradingModules) {
      const moduleGroupId = grading.module.moduleGroup.id
      if (!countedModuleGroupIds[moduleGroupId]) {
        countedModuleGroupIds[moduleGroupId] = true
        moduleGroups.push({
          name: grading.module.moduleGroup.name as string,
          id: moduleGroupId as string,
        })
      }
    }
  }

  const moduleNamesGroupedByModuleGroup: ModuleNamesGroupedByModuleGroupMapping =
    {}
  for (const moduleGroup of moduleGroups) {
    const moduleGroupId = moduleGroup.id
    const moduleNamesForGroup = []
    for (const grading of courseParticipant.gradingModules) {
      if (grading.module.moduleGroup.id === moduleGroupId) {
        moduleNamesForGroup.push({
          name: grading.module.name as string,
          completed: grading.completed as boolean,
        })
      }
    }
    moduleNamesGroupedByModuleGroup[moduleGroupId] = moduleNamesForGroup
  }
  return [moduleGroups, moduleNamesGroupedByModuleGroup]
}

const styles = StyleSheet.create({
  pageBackground: {
    position: 'absolute',
    minWidth: '99%',
    minHeight: '99%',
    height: '99%',
    width: '99%',
  },
  page: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0D2860',
    fontWeight: 990,
    marginBottom: '20',
    fontSize: '24px',
  },
  text: {
    marginBottom: '20',
  },
  grey: {
    color: 'grey',
  },
  smallerText: {
    fontSize: '10px',
    marginBottom: '12',
  },
  blue: {
    color: '#0D2860',
  },
  largerText: {
    fontWeight: 990,
    fontSize: '15px',
  },
  largestText: {
    fontWeight: 990,
    fontSize: '18px',
  },
  participantName: {
    marginBottom: '20',
    fontWeight: 'black',
  },
  footer: {
    fontSize: '8px',
    width: '70%',
    marginLeft: '120',
    marginRight: '120',
    marginTop: '30',
  },
})

type CertificateDocumentProps = {
  participantName: string
  courseName: string
  courseDuration: number
  courseLevel: CourseLevel
  grade: Grade
  courseDeliveryType: CourseDeliveryType
  certificationNumber: string
  expiryDate: string
}

const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  participantName,
  courseName,
  courseDuration,
  courseLevel,
  grade,
  courseDeliveryType,
  certificationNumber,
  expiryDate,
}) => {
  const { t } = useTranslation()

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image
          src={
            courseLevel === CourseLevel.BILD_ACT
              ? BILDOutlineImage
              : ICMOutlineImage
          }
          style={styles.pageBackground}
        />
        <Text style={{ ...styles.title, marginTop: '100' }}>
          {' '}
          {t('common.course-certificate.title')}
        </Text>
        <Text style={styles.participantName}>{participantName}</Text>
        <Text style={{ ...styles.grey, ...styles.smallerText }}>
          {t('common.course-certificate.completed-message')}
        </Text>
        <Text style={{ ...styles.text, ...styles.largerText }}>
          {courseName}
        </Text>
        <Text style={{ ...styles.text, ...styles.largestText, ...styles.blue }}>
          {t(`common.certificates.${courseLevel?.toLowerCase()}`) +
            ` - ${courseDuration} hours`}
        </Text>

        {[
          CourseLevel.LEVEL_1,
          CourseLevel.LEVEL_2,
          CourseLevel.ADVANCED,
        ].includes(courseLevel) ? (
          <Text style={styles.smallerText}>
            {t('common.course-certificate.levels-limitation-message')}
          </Text>
        ) : null}
        {courseDeliveryType !== CourseDeliveryType.F2F ||
        grade === Grade.OBSERVE_ONLY ? (
          <Text style={styles.smallerText}>
            {t('common.course-certificate.physical-limitation-message')}
          </Text>
        ) : null}
        <Text style={styles.smallerText}>
          {' '}
          {t('common.course-certificate.certification-number-message') +
            ' ' +
            certificationNumber}
        </Text>
        <Text style={styles.smallerText}>
          {' '}
          {t('common.course-certificate.certification-valid-until-message') +
            ' ' +
            format(new Date(expiryDate), 'dd/M/yyyy')}
        </Text>
        <Text style={styles.footer}>
          {t('common.course-certificate.certificate-footer')}
        </Text>
      </Page>
    </Document>
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

  const [moduleGroups, moduleNamesGroupedByModuleGroup] =
    getModuleData(courseParticipant)

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

        <Typography variant="body2" gutterBottom sx={{ ml: { sm: 10, md: 2 } }}>
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

      <Typography variant="h3" gutterBottom>
        {t('common.course-certificate.modules-list-title')}
      </Typography>

      {moduleGroups.map(moduleGroup => {
        return (
          <ModuleGroupAccordion
            key={moduleGroup.id}
            moduleGroupName={moduleGroup.name}
            completedModules={moduleNamesGroupedByModuleGroup[
              moduleGroup.id
            ].filter(module => module.completed === true)}
            uncompletedModules={moduleNamesGroupedByModuleGroup[
              moduleGroup.id
            ].filter(module => module.completed === false)}
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

  // TODO : change when we know what this should be
  const certificationNumber = courseParticipant.id

  const grade = courseParticipant?.grade

  const startDate = course.dates.aggregate.start.date
  const endDate = course.dates.aggregate.end.date

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

  const courseLevel = course.level

  const expiryDate = add(dateIssued, {
    months: validUntilMonthsByCourseLevel[courseLevel],
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
                      courseDuration={differenceInHours(
                        new Date(endDate),
                        new Date(startDate)
                      )}
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
