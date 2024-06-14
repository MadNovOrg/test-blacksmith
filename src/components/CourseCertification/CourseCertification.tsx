import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import pdf from '@react-pdf/renderer'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'urql'

import {
  CertificateAssistIcon,
  CertificateObserveIcon,
  CertificatePassIcon,
} from '@app/assets'
import { Dialog } from '@app/components/dialogs'
import { ManageCertificateMenu } from '@app/components/ManageCertificateMenu'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Certificate_Changelog_Type_Enum,
  GetCertificateQuery,
  GetCertificateQueryVariables,
  Grade_Enum,
  Course_Level_Enum,
  CertificateStatus,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CertificateDocument } from '@app/modules/certifications/components/CertificatePDF'
import { ProfileAvatar } from '@app/modules/profile/components/ProfileAvatar'
import { GET_CERTIFICATE_QUERY } from '@app/queries/certificate/get-certificate'

import CertificateHoldHistoryModal from './components/CertificateHoldHistoryModal/CertificateHoldHistoryModal'
import { CertificateInfo } from './components/CertificateInfo/CertificateInfo'
import ChangelogModal from './components/ChangelogModal/ChangelogModal'
import HoldHeaderAlert from './components/HoldHeaderAlert/HoldHeaderAlert'
import ModifyGradeModal from './components/ModifyGradeModal/ModifyGradeModal'
import PutOnHoldModal from './components/PutOnHoldModal/PutOnHoldModal'
import RevokeCertModal from './components/RevokeModal/RevokeModal'
import UndoRevokeModal from './components/UndoRevokeModal/UndoRevokeModal'

// workaround for using recat-pdf with vite
const { PDFDownloadLink } = pdf

const gradesToCertificateIconMapping = {
  PASS: <CertificatePassIcon width={200} height={200} />,
  OBSERVE_ONLY: <CertificateObserveIcon width={200} height={200} />,
  ASSIST_ONLY: <CertificateAssistIcon width={200} height={200} />,
  FAIL: null,
}

type CourseCertificationProps = {
  certificateId: string
}

export const CourseCertification: React.FC<
  React.PropsWithChildren<CourseCertificationProps>
> = ({ certificateId }) => {
  const { t, _t } = useScopedTranslation('common.course-certificate')
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  const [{ data, error, fetching }, mutate] = useQuery<
    GetCertificateQuery,
    GetCertificateQueryVariables
  >({ query: GET_CERTIFICATE_QUERY, variables: { id: certificateId } })

  const certificate = data?.certificate
  const holdRequest = data?.certificateHoldRequest[0]
  const courseParticipant = certificate?.participant
  const isLegacyCertificate = certificate && !certificate.participant

  const holdChangelogs = useMemo(() => {
    return (
      certificate?.participant?.certificateChanges.filter(
        change =>
          change.type === Course_Certificate_Changelog_Type_Enum.PutOnHold
      ) ?? []
    )
  }, [certificate])

  if (fetching) {
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

  if (!certificate || !certificate.profile || error) {
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

  const isRevoked = certificate.status === CertificateStatus.Revoked
  const isOnHold = certificate.status === CertificateStatus.OnHold

  const statusTooltip =
    isRevoked || isOnHold
      ? certificate.participant?.certificateChanges[0]?.payload?.note
      : ''

  if (isRevoked && (acl.isUser() || acl.isTrainer())) {
    return null
  }

  return (
    <Box mb={6}>
      <Container disableGutters={isMobile}>
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
                    isRevoked || certificate.status === CertificateStatus.OnHold
                  }
                >
                  <PDFDownloadLink
                    style={{ color: 'white' }}
                    document={
                      <CertificateDocument
                        participantName={certificate.profile.fullName ?? ''}
                        courseLevel={
                          certificate.courseLevel as Course_Level_Enum
                        }
                        grade={grade as Grade_Enum}
                        certificationNumber={certificationNumber}
                        expiryDate={certificate.expiryDate}
                        accreditedBy={
                          certificate.courseAccreditedBy ?? Accreditors_Enum.Icm
                        }
                        blendedLearning={certificate.blendedLearning ?? false}
                        reaccreditation={certificate.reaccreditation ?? false}
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
              {acl.canManageCert() && !isLegacyCertificate && (
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
          <Grid item md={8} xs={12}>
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
              accreditedBy={certificate.courseAccreditedBy as Accreditors_Enum}
              grade={grade as Grade_Enum}
              courseParticipant={courseParticipant}
              courseName={certificate.courseName}
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
            title={
              showPutOnHoldModal.edit
                ? t('this-certificate-hold')
                : t('hold-certificate')
            }
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
              edit={showPutOnHoldModal.edit}
              changelogs={holdChangelogs}
            />
          </Dialog>

          <Dialog
            open={showModifyGradeModal}
            onClose={() => setShowModifyGradeModal(false)}
            slots={{
              Title: () => <>{t('modify-grade')}</>,
            }}
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
              <ChangelogModal
                changelogs={certificate?.participant?.certificateChanges}
              />
            ) : null}
          </Dialog>
        </>
      ) : null}

      {showRevokeCertModal && certificate.participant && (
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

      {showUndoRevokeModal && certificate.participant && (
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
