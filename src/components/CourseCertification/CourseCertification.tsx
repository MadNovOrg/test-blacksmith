import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import pdf from '@react-pdf/renderer'
import MUIImage from 'mui-image'
import React, { useMemo, useState } from 'react'
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
import PutOnHoldModal from '@app/components/CourseCertification/PutOnHoldModal'
import RevokeCertModal from '@app/components/CourseCertification/RevokeCertModal'
import { Dialog } from '@app/components/Dialog'
import { ManageCertificateMenu } from '@app/components/ManageCertificateMenu'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { useAuth } from '@app/context/auth'
import {
  Course_Certificate_Changelog_Type_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Participant_Module,
  GetCertificateQuery,
  GetCertificateQueryVariables,
  Grade_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { QUERY } from '@app/queries/certificate/get-certificate'
import theme from '@app/theme'
import { CertificateStatus, CourseLevel, NonNullish } from '@app/types'
import {
  getSWRLoadingStatus,
  LoadingStatus,
  transformModulesToGroups,
} from '@app/util'

import { CertificateStatusChip } from '../CertificateStatusChip'

import CertificateHoldHistoryModal from './CertificateHoldHistoryModal'
import HoldHeaderAlert from './HoldHeaderAlert'
import UndoRevokeModal from './UndoRevokeModal'

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

const UncompletedList: React.FC<
  React.PropsWithChildren<UncompletedListProps>
> = ({ uncompletedModules }) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Typography variant="body2" color="grey.500" gutterBottom>
        {t('incomplete')}
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

const ModuleGroupAccordion: React.FC<
  React.PropsWithChildren<ModuleGroupAccordionProps>
> = ({ moduleGroupName, completedModules, uncompletedModules }) => {
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

type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>

type CertificateInfoProps = {
  courseParticipant?: Participant['participant']
  grade: Grade_Enum
  revokedDate: string
  expiryDate: string
  certificationNumber: string
  dateIssued: string
  status: CertificateStatus
  statusTooltip?: string
  expireHoldDate?: string
  onShowChangelogModal: VoidFunction
}

const CertificateInfo: React.FC<
  React.PropsWithChildren<CertificateInfoProps>
> = ({
  courseParticipant,
  grade,
  revokedDate,
  expiryDate,
  certificationNumber,
  dateIssued,
  status,
  statusTooltip,
  expireHoldDate,
  onShowChangelogModal,
}) => {
  const imageSize = '10%'
  const { t, _t } = useScopedTranslation('common.course-certificate')
  const { acl } = useAuth()

  const moduleGroupsWithModules = courseParticipant
    ? transformModulesToGroups(
        courseParticipant.gradingModules as unknown as Course_Participant_Module[]
      )
    : null

  const isRevoked = status === CertificateStatus.REVOKED
  const isOnHold = status === CertificateStatus.ON_HOLD

  return (
    <Box>
      {isRevoked ? (
        <Alert severity="warning" sx={{ mb: 2 }} variant="outlined">
          {t('revoked-warning')}
          {acl.isTTAdmin() ? (
            <Button
              variant="text"
              color="primary"
              sx={{ ml: 1, py: 0 }}
              size="small"
              onClick={onShowChangelogModal}
            >
              {_t('view-details')}
            </Button>
          ) : (
            t('revoked-warning-user')
          )}
        </Alert>
      ) : null}

      <Typography
        color={theme.palette.dimGrey.main}
        variant="subtitle2"
        sx={{ mb: 2 }}
      >
        {t('certified-message')}
      </Typography>

      <Typography data-testid="certificate-grade" variant="h2" gutterBottom>
        {t(`${grade.toLowerCase()}-title`)}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {courseParticipant?.course?.name}
      </Typography>

      {grade !== Grade_Enum.Fail ? (
        <>
          <Grid container spacing={2} mt={4}>
            <Grid item xs={3}>
              <Typography
                data-testid="certificate-issue-date"
                variant="body2"
                sx={{ mb: 1 }}
                color="grey.500"
              >
                {t('issue-date')}
              </Typography>
              <Typography variant="body1">
                {_t('dates.default', { date: dateIssued })}
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body2" sx={{ mb: 1 }} color="grey.500">
                {t('number')}
              </Typography>
              <Typography data-testid="certificate-number" variant="body1">
                {certificationNumber}
              </Typography>
            </Grid>

            {isRevoked ? (
              <Grid item xs={3}>
                <Typography variant="body2" sx={{ mb: 1 }} color="grey.500">
                  {t('revoked-on')}
                </Typography>
                <Typography variant="body1">
                  {_t('dates.default', { date: revokedDate })}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={3}>
                <Typography
                  data-testid="certificate-valid-until"
                  variant="body2"
                  sx={{ mb: 1 }}
                  color="grey.500"
                >
                  {t('valid-until')}
                </Typography>
                <Typography variant="body1">
                  {_t('dates.default', { date: expiryDate })}
                </Typography>
              </Grid>
            )}
            <Grid item xs={3}>
              <Typography variant="body2" sx={{ mb: 1 }} color="grey.500">
                {_t('status')}
              </Typography>
              <Box display="flex" alignItems="center">
                <CertificateStatusChip
                  status={status}
                  tooltip={statusTooltip}
                />
                {isOnHold ? (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {t(`on-hold-until`, {
                      expireDate: expireHoldDate,
                    })}
                  </Typography>
                ) : null}
              </Box>
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
            <MUIImage
              duration={0}
              src={icmImage}
              width={imageSize}
              height={imageSize}
            />
            <MUIImage
              duration={0}
              src={cpdImage}
              width={imageSize}
              height={imageSize}
              sx={{ mt: 2 }}
            />
            <MUIImage
              duration={0}
              src={ntaImage}
              width={imageSize}
              height={imageSize}
              sx={{ mt: 2 }}
            />
          </Box>
        </>
      ) : null}

      {moduleGroupsWithModules?.length ? (
        <>
          <Typography variant="h3" gutterBottom>
            {t('modules-list-title')}
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
        </>
      ) : null}

      {!courseParticipant ? (
        <Typography variant="body2">
          {t('completed-modules-unavailable')}
        </Typography>
      ) : null}
    </Box>
  )
}

type CourseCertificationProps = {
  certificateId: string
}

export const CourseCertification: React.FC<
  React.PropsWithChildren<CourseCertificationProps>
> = ({ certificateId }) => {
  const { t, _t } = useScopedTranslation('common.course-certificate')
  const { acl } = useAuth()

  const [showModifyGradeModal, setShowModifyGradeModal] = useState(false)
  const [showChangelogModal, setShowChangelogModal] = useState(false)
  const [showPutOnHoldModal, setShowPutOnHoldModal] = useState({
    edit: false,
    open: false,
  })
  const [showRevokeCertModal, setShowRevokeCertModal] = useState(false)
  const [showUndoRevokeModal, setShowUndoRevokeModal] = useState(false)
  const [showCertificateHoldHistoryModal, setShowCertificateHoldHistoryModal] =
    useState(false)

  const { data, error, mutate } = useSWR<
    GetCertificateQuery,
    Error,
    [string, GetCertificateQueryVariables]
  >([QUERY, { id: certificateId }])
  const certificateLoadingStatus = getSWRLoadingStatus(data, error)

  const certificate = data?.certificate
  const holdRequest = data?.certificateHoldRequest[0]
  const courseParticipant = certificate?.participant

  const gradingChangelogs = useMemo(() => {
    return (
      certificate?.participant?.certificateChanges.filter(
        change =>
          change.type !== Course_Certificate_Changelog_Type_Enum.PutOnHold
      ) ?? []
    )
  }, [certificate])

  const holdChangelogs = useMemo(() => {
    return (
      certificate?.participant?.certificateChanges.filter(
        change =>
          change.type === Course_Certificate_Changelog_Type_Enum.PutOnHold
      ) ?? []
    )
  }, [certificate])

  if (certificateLoadingStatus === LoadingStatus.FETCHING) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="certificate-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  if (
    !certificate ||
    !certificate.profile ||
    !certificate.participant ||
    certificateLoadingStatus === LoadingStatus.ERROR
  ) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert severity="error" variant="outlined">
          {_t('internal-error')}
        </Alert>
      </Container>
    )
  }

  const certificationNumber = certificate.number ?? ''
  const grade = courseParticipant?.grade ?? Grade_Enum.Pass

  if (courseParticipant && !courseParticipant?.grade) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert variant="outlined" color="warning">
          {t('not-graded-yet')}
        </Alert>
      </Container>
    )
  }

  const courseDeliveryType = courseParticipant?.course.deliveryType

  const isRevoked = certificate.status === CertificateStatus.REVOKED
  const isOnHold = certificate.status === CertificateStatus.ON_HOLD

  const statusTooltip =
    isRevoked || isOnHold
      ? certificate.participant.certificateChanges[0].payload.note
      : ''

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
                    {_t('common.attendee')}
                  </Typography>
                  <ProfileAvatar profile={certificate.profile} sx={{ pt: 1 }} />
                </Box>
              ) : null}

              {grade !== Grade_Enum.Fail ? (
                <Button
                  fullWidth
                  data-testid="download-certificate-button"
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={
                    isRevoked ||
                    certificate.status === CertificateStatus.ON_HOLD
                  }
                >
                  <PDFDownloadLink
                    style={{ color: 'white' }}
                    document={
                      <CertificateDocument
                        participantName={certificate.profile.fullName ?? ''}
                        courseName={certificate.courseName}
                        courseLevel={certificate.courseLevel as CourseLevel}
                        grade={grade as Grade_Enum}
                        courseDeliveryType={
                          courseDeliveryType ?? Course_Delivery_Type_Enum.F2F
                        }
                        certificationNumber={certificationNumber}
                        expiryDate={certificate.expiryDate}
                      />
                    }
                    fileName="certificate.pdf"
                  >
                    {({ loading, error }) =>
                      loading
                        ? t('cert-loading')
                        : error
                        ? t('cert-error')
                        : t('download-certificate')
                    }
                  </PDFDownloadLink>
                </Button>
              ) : null}
              {acl.canManageCert() && (
                <ManageCertificateMenu
                  isRevoked={isRevoked}
                  certificateChangeLength={
                    certificate.participant?.certificateChanges?.length
                  }
                  onShowModifyGrade={() => setShowModifyGradeModal(true)}
                  onShowPutOnHoldModal={() =>
                    setShowPutOnHoldModal({
                      edit: Boolean(holdRequest) ?? false,
                      open: true,
                    })
                  }
                  onShowRevokeModal={() => setShowRevokeCertModal(true)}
                  onShowUndoRevokeModal={() => setShowUndoRevokeModal(true)}
                  onShowChangelogModal={() => setShowChangelogModal(true)}
                />
              )}
            </Grid>
          </Grid>
          <Grid item md={8}>
            {holdRequest ? (
              <HoldHeaderAlert
                status={certificate.status as CertificateStatus}
                holdRequestEndDate={holdRequest.expiry_date}
                holdRequestStartDate={holdRequest.start_date}
                onEdit={() => setShowPutOnHoldModal({ edit: true, open: true })}
                onView={() => setShowCertificateHoldHistoryModal(true)}
              />
            ) : null}
            <CertificateInfo
              grade={grade as Grade_Enum}
              courseParticipant={courseParticipant}
              revokedDate={certificate.updatedAt}
              expiryDate={certificate.expiryDate}
              certificationNumber={certificationNumber}
              dateIssued={certificate.certificationDate}
              status={certificate.status as CertificateStatus}
              statusTooltip={statusTooltip}
              expireHoldDate={holdRequest ? holdRequest.expiry_date : undefined}
              onShowChangelogModal={() => setShowChangelogModal(true)}
            />
          </Grid>
        </Grid>
      </Container>

      {courseParticipant ? (
        <>
          <Dialog
            open={showPutOnHoldModal.open}
            onClose={() => setShowPutOnHoldModal({ edit: false, open: false })}
            title={t('hold-certificate')}
            maxWidth={800}
          >
            <PutOnHoldModal
              onClose={() => {
                setShowPutOnHoldModal({ edit: false, open: false })
                mutate()
              }}
              participantId={courseParticipant.id}
              certificateId={certificateId}
              certificateExpiryDate={certificate.expiryDate}
              courseLevel={
                certificate.courseLevel as unknown as Course_Level_Enum
              }
              edit={showPutOnHoldModal.edit}
              changelogs={holdChangelogs}
            />
          </Dialog>

          <Dialog
            open={showModifyGradeModal}
            onClose={() => setShowModifyGradeModal(false)}
            title={t('modify-grade')}
            maxWidth={800}
          >
            <ModifyGradeModal
              certificateId={certificateId}
              participant={courseParticipant}
              onClose={() => setShowModifyGradeModal(false)}
            />
          </Dialog>

          <Dialog
            open={showCertificateHoldHistoryModal}
            onClose={() => setShowCertificateHoldHistoryModal(false)}
            title={t('certificate-hold-history-log')}
            minWidth={1000}
          >
            {holdChangelogs ? (
              <CertificateHoldHistoryModal changelogs={holdChangelogs} />
            ) : null}
          </Dialog>

          <Dialog
            open={showChangelogModal}
            onClose={() => setShowChangelogModal(false)}
            title={t('change-log')}
            maxWidth={800}
          >
            {certificate.participant?.certificateChanges?.length ? (
              <ChangelogModal changelogs={gradingChangelogs} />
            ) : null}
          </Dialog>
        </>
      ) : null}

      {showRevokeCertModal && (
        <Dialog
          open={showRevokeCertModal}
          onClose={() => setShowRevokeCertModal(false)}
          title={
            <Typography variant="h3">{t('revoke-certificate')}</Typography>
          }
          maxWidth={800}
        >
          <RevokeCertModal
            certificateId={certificateId}
            participantId={certificate.participant.id}
            onClose={() => setShowRevokeCertModal(false)}
            onSuccess={() => {
              setShowRevokeCertModal(false)
              mutate()
            }}
          />
        </Dialog>
      )}

      {showUndoRevokeModal && (
        <Dialog
          open={showUndoRevokeModal}
          onClose={() => setShowUndoRevokeModal(false)}
          title={<Typography variant="h3">{t('undo-revoke')}</Typography>}
          maxWidth={600}
        >
          <UndoRevokeModal
            certificateId={certificateId}
            participantId={certificate.participant.id}
            onClose={() => setShowUndoRevokeModal(false)}
            onSuccess={() => {
              setShowUndoRevokeModal(false)
              mutate()
            }}
          />
        </Dialog>
      )}
    </Box>
  )
}
