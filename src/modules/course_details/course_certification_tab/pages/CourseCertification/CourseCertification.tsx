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
import { allPass } from 'lodash/fp'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'urql'

import {
  CertificateAssistIcon,
  CertificateObserveIcon,
  CertificatePassIcon,
} from '@app/assets'
import { Dialog } from '@app/components/dialogs'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Certificate_Changelog_Type_Enum,
  GetCertificateQuery,
  GetCertificateQueryVariables,
  Grade_Enum,
  Course_Level_Enum,
  Certificate_Status_Enum,
  Course_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CertificateDocument } from '@app/modules/certifications/components/CertificatePDF'
import { ManageCertificateMenu } from '@app/modules/course_details/course_certification_tab/components/ManageCertificateMenu'
import { GET_CERTIFICATE_QUERY } from '@app/modules/course_details/course_certification_tab/queries/get-certificate'
import { NonNullish } from '@app/types'

import CertificateHoldHistoryModal from '../../components/CertificateHoldHistoryModal/CertificateHoldHistoryModal'
import { CertificateInfo } from '../../components/CertificateInfo/CertificateInfo'
import ChangelogModal from '../../components/ChangelogModal/ChangelogModal'
import HoldHeaderAlert from '../../components/HoldHeaderAlert/HoldHeaderAlert'
import ModifyGradeModal from '../../components/ModifyGradeModal/ModifyGradeModal'
import PutOnHoldModal from '../../components/PutOnHoldModal/PutOnHoldModal'
import RevokeCertModal from '../../components/RevokeModal/RevokeModal'
import UndoRevokeModal from '../../components/UndoRevokeModal/UndoRevokeModal'
import { CertificateChangelog as CertificateChangelogType } from '../CourseCertification/types'

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

const CertificateChangelog: React.FC<{
  holdChangelogs: NonNullish<CertificateChangelogType['certificateChanges']>
}> = ({ holdChangelogs }) => {
  if (!holdChangelogs) return
  return <CertificateHoldHistoryModal changelogs={holdChangelogs} />
}

export const CourseCertification: React.FC<
  React.PropsWithChildren<CourseCertificationProps>
> = ({ certificateId }) => {
  const { t, _t } = useScopedTranslation('common.course-certificate')
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

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

  const [{ data, error, fetching }, refetch] = useQuery<
    GetCertificateQuery,
    GetCertificateQueryVariables
  >({ query: GET_CERTIFICATE_QUERY, variables: { id: certificateId } })

  const certificate = data?.certificate
  const holdRequest = data?.certificateHoldRequest[0]
  const courseParticipant = certificate?.participant
  const isLegacyCertificate = !certificate?.participant

  const certificateStatus = useCallback(
    ({ loading, error }: { loading: boolean; error: Error | null }) => {
      if (loading) return t('cert-loading')
      if (error) return t('cert-error')
      return t('download-certificate')
    },
    [t],
  )

  const holdChangelogs = useMemo(() => {
    return (
      certificate?.participant?.certificateChanges.filter(
        change =>
          change.type === Course_Certificate_Changelog_Type_Enum.PutOnHold,
      ) ?? []
    )
  }, [certificate])

  const grade = useMemo(() => {
    const displayNonPhysicalGrade = allPass([
      () => courseParticipant?.course?.level === Course_Level_Enum.Level_1,
      () =>
        courseParticipant?.course?.deliveryType ===
        Course_Delivery_Type_Enum.Virtual,
      () => courseParticipant?.grade === Grade_Enum.Pass,
    ])()

    if (displayNonPhysicalGrade) return Grade_Enum.ObserveOnly

    return courseParticipant?.grade ?? Grade_Enum.Pass
  }, [
    courseParticipant?.course?.deliveryType,
    courseParticipant?.course?.level,
    courseParticipant?.grade,
  ])

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

  if (!certificate?.profile || error) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert severity="error" variant="outlined">
          {_t('internal-error')}
        </Alert>
      </Container>
    )
  }

  const certificationNumber = certificate.number ?? ''

  if (courseParticipant && !courseParticipant?.grade) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert variant="outlined" color="warning">
          {t('not-graded-yet')}
        </Alert>
      </Container>
    )
  }

  const isRevoked = certificate.status === Certificate_Status_Enum.Revoked
  const isOnHold = certificate.status === Certificate_Status_Enum.OnHold

  const statusTooltip =
    isRevoked || isOnHold
      ? certificate.participant?.certificateChanges[0]?.payload?.note
      : ''

  if (isRevoked && (acl.isUser() || acl.isTrainer())) {
    return null
  }

  const handleCertificateUpate = () => {
    navigate('/certifications/edit', {
      state: {
        participants: [courseParticipant?.id],
        courseId: courseParticipant?.course.id,
      },
    })
  }

  return (
    <Box mb={6}>
      <Container disableGutters={isMobile}>
        <Grid container>
          <Grid item md={3} px={4}>
            <Grid container gap={2}>
              <Box sx={{ mb: 2 }} mx="auto">
                {gradesToCertificateIconMapping[grade] ?? null}
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
                    certificate.status === Certificate_Status_Enum.OnHold
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
                        isAustralia={acl.isAustralia()}
                      />
                    }
                    fileName="certificate.pdf"
                  >
                    {certificateStatus}
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
                      edit: Boolean(holdRequest),
                      open: true,
                    })
                  }
                  onShowRevokeModal={() => setShowRevokeCertModal(true)}
                  onShowUndoRevokeModal={() => setShowUndoRevokeModal(true)}
                  onShowChangelogModal={() => setShowChangelogModal(true)}
                  onUpdateCertificate={handleCertificateUpate}
                />
              )}
            </Grid>
          </Grid>
          <Grid item md={8} xs={12}>
            {holdRequest?.expiry_date ? (
              <HoldHeaderAlert
                status={certificate.status as Certificate_Status_Enum}
                holdRequestEndDate={holdRequest.expiry_date}
                holdRequestStartDate={holdRequest.start_date}
                onEdit={() => setShowPutOnHoldModal({ edit: true, open: true })}
                onView={() => setShowCertificateHoldHistoryModal(true)}
              />
            ) : null}
            <CertificateInfo
              accreditedBy={certificate.courseAccreditedBy as Accreditors_Enum}
              grade={grade}
              courseParticipant={courseParticipant}
              courseName={certificate.courseName}
              revokedDate={certificate.updatedAt}
              expiryDate={certificate.expiryDate}
              certificationNumber={certificationNumber}
              dateIssued={certificate.certificationDate}
              status={certificate.status as Certificate_Status_Enum}
              statusTooltip={statusTooltip}
              expireHoldDate={holdRequest?.expiry_date}
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
            slots={{
              Title: () => (
                <>
                  {showPutOnHoldModal.edit
                    ? t('this-certificate-hold')
                    : t('hold-certificate')}
                </>
              ),
              Content: () => (
                <PutOnHoldModal
                  onClose={() => {
                    setShowPutOnHoldModal({ edit: false, open: false })
                    refetch()
                  }}
                  participantId={courseParticipant.id}
                  certificateId={certificateId}
                  certificateExpiryDate={certificate.expiryDate}
                  edit={showPutOnHoldModal.edit}
                  changelogs={holdChangelogs}
                  holdRequest={holdRequest}
                  refetch={refetch}
                />
              ),
            }}
            maxWidth={800}
          />

          <Dialog
            open={showModifyGradeModal}
            onClose={() => setShowModifyGradeModal(false)}
            slots={{
              Title: () => <>{t('modify-grade')}</>,
              Content: () => (
                <ModifyGradeModal
                  certificateId={certificateId}
                  participant={courseParticipant}
                  onClose={() => setShowModifyGradeModal(false)}
                />
              ),
            }}
            maxWidth={800}
          />

          <Dialog
            open={showCertificateHoldHistoryModal}
            onClose={() => setShowCertificateHoldHistoryModal(false)}
            slots={{
              Title: () => <>{t('certificate-hold-history-log')}</>,
              Content: () => (
                <CertificateChangelog holdChangelogs={holdChangelogs} />
              ),
            }}
            minWidth={1000}
          />

          <Dialog
            open={showChangelogModal}
            onClose={() => setShowChangelogModal(false)}
            slots={{
              Title: () => <>{t('change-log')}</>,
              Content: () => (
                <ChangelogModal
                  changelogs={
                    certificate?.participant?.certificateChanges ?? []
                  }
                />
              ),
            }}
            maxWidth={800}
          />
        </>
      ) : null}

      {showRevokeCertModal && certificate.participant && (
        <Dialog
          open={showRevokeCertModal}
          onClose={() => setShowRevokeCertModal(false)}
          slots={{
            Title: () => (
              <Typography variant="h3">{t('revoke-certificate')}</Typography>
            ),
            Content: () => (
              <RevokeCertModal
                certificateId={certificateId}
                participantId={certificate.participant?.id}
                onClose={() => setShowRevokeCertModal(false)}
                onSuccess={() => {
                  setShowRevokeCertModal(false)
                  refetch()
                }}
              />
            ),
          }}
          maxWidth={800}
        />
      )}

      {showUndoRevokeModal && certificate.participant && (
        <Dialog
          open={showUndoRevokeModal}
          onClose={() => setShowUndoRevokeModal(false)}
          slots={{
            Title: () => (
              <Typography variant="h3">{t('undo-revoke')}</Typography>
            ),
            Content: () => (
              <UndoRevokeModal
                certificateId={certificateId}
                participantId={certificate.participant?.id}
                onClose={() => setShowUndoRevokeModal(false)}
                onSuccess={() => {
                  setShowUndoRevokeModal(false)
                  refetch()
                }}
              />
            ),
          }}
          maxWidth={600}
        />
      )}
    </Box>
  )
}
