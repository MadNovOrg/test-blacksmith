import { TableCell, Box, Typography, TableRow, Button } from '@mui/material'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LinkToProfile } from '@app/components/LinkToProfile'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { useAuth } from '@app/context/auth'
import { Certificate_Status_Enum } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import { Grade } from '@app/modules/grading/components/Grade'
import { CourseParticipant } from '@app/types'

import { CertificateStatusChip } from '../../CertificateStatusChip'

export const ParticipantsRow: FC<{
  participant: CourseParticipant
  showCol: (col: string) => boolean
  checkbox: ReturnType<typeof useTableChecks>['checkbox']
}> = ({ participant, showCol, checkbox }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    acl: { canViewProfiles, canViewArchivedProfileData, canViewRevokedCert },
  } = useAuth()

  const renderCell = (id: string, content: ReactNode) => {
    return showCol(id) ? <TableCell>{content}</TableCell> : null
  }

  if (!participant.certificate) return null
  const status = participant.certificate?.status
  const isRevoked =
    participant.certificate.status === Certificate_Status_Enum.Revoked
  const isOnHold =
    participant.certificate.status === Certificate_Status_Enum.OnHold
  const statusTooltip =
    isRevoked || isOnHold
      ? participant.certificateChanges?.[0]?.payload?.note ?? '' // if revoked or on hold, the first changelog has the reason
      : undefined

  const RenderContentMap: Record<string, ReactNode> = {
    name: (
      <ProfileAvatar
        profile={participant.profile}
        disableLink={
          !canViewProfiles() ||
          (participant.profile.archived && !canViewArchivedProfileData())
        }
      />
    ),
    contact: (
      <LinkToProfile
        profileId={participant.profile.id}
        isProfileArchived={participant.profile.archived}
      >
        {participant.profile.email}
        {participant.profile.contactDetails.map(contact => contact.value)}
      </LinkToProfile>
    ),
    organisation: (
      <Box display={'flex'} flexDirection={'column'}>
        {participant.profile.organizations.map(o => {
          return (
            <Typography key={o.organization.id}>
              {o.organization.name}
            </Typography>
          )
        })}
      </Box>
    ),
    grade: (
      <TableCell data-testid="grade">
        <Box display="flex" alignItems="flex-start">
          {participant.grade ? <Grade grade={participant.grade} /> : null}
        </Box>
      </TableCell>
    ),
    certificate: (
      <TableCell data-testid="certificate">
        {participant.grade ? (
          <>
            <Grade grade={participant.grade} />
            <Typography
              data-testid="certificate-number"
              variant="body2"
              color="grey.700"
            >
              {participant.certificate.number}
            </Typography>
          </>
        ) : null}
      </TableCell>
    ),
    'course-code': (
      <TableCell data-testid="course-code">
        <Typography variant="body2" color="grey.700">
          {participant.course?.course_code}
        </Typography>
      </TableCell>
    ),
    status: (
      <TableCell data-testid="status">
        <CertificateStatusChip status={status} tooltip={statusTooltip} />
      </TableCell>
    ),
    'date-obtained': (
      <TableCell data-testid="date-obtained">
        <Typography variant="body2" color="grey.700">
          {t('dates.default', {
            date: participant.certificate.certificationDate,
          })}
        </Typography>
      </TableCell>
    ),
    'date-expired': (
      <TableCell data-testid="date-expired">
        <Typography variant="body2" color="grey.700">
          {t('dates.default', {
            date: participant.certificate.expiryDate,
          })}
        </Typography>
      </TableCell>
    ),
  }

  return (
    <TableRow data-testid={`cert-row-${participant.id}`}>
      {checkbox.rowCell(participant.id, isRevoked)}
      {Object.keys(RenderContentMap).map(key =>
        renderCell(key, RenderContentMap[key]),
      )}
      <TableCell sx={{ width: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() =>
              navigate(`/certification/${participant.certificate?.id}`)
            }
            data-testid={`view-certificate-${participant.course?.id}`}
            disabled={isRevoked && !canViewRevokedCert()}
          >
            {t('components.certification-list.view-certificate')}
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  )
}
