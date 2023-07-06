import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { GetCertificateQuery } from '@app/generated/graphql'
import { NonNullish } from '@app/types'

type Participant = Pick<
  NonNullish<GetCertificateQuery['certificate']>,
  'participant'
>

type CertificateChangelog = Pick<
  NonNullish<Participant['participant']>,
  'certificateChanges'
>

export type ChangelogModalProps = {
  changelogs: NonNullish<CertificateChangelog['certificateChanges']>
}

const CertificateHoldHistoryModal: React.FC<
  React.PropsWithChildren<ChangelogModalProps>
> = function ({ changelogs }) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHead>
        <TableRow
          sx={{
            '&&.MuiTableRow-root': {
              backgroundColor: 'grey.300',
            },
            '&& .MuiTableCell-root': {
              px: 2,
              py: 1,
              color: 'grey.700',
              fontWeight: '600',
            },
          }}
        >
          <TableCell>{t('components.changelog-modal.administrator')}</TableCell>
          <TableCell>
            {t('components.changelog-modal.date-of-action')}
          </TableCell>
          <TableCell>{t('common.reason')}</TableCell>
          <TableCell>{t('components.changelog-modal.dates')}</TableCell>
          <TableCell>{t('components.changelog-modal.notes')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody
        sx={{
          '&& .MuiTableRow-root': {
            backgroundColor: 'common.white',
            borderTop: '1px solid',
            borderColor: 'grey.300',
          },
        }}
      >
        {changelogs.map(changelog => (
          <TableRow key={changelog.id}>
            <TableCell sx={{ verticalAlign: 'top' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <ProfileAvatar profile={changelog.author} />
              </Box>
            </TableCell>
            <TableCell>
              {t('dates.fullDateTime', { date: changelog.createdAt })}
            </TableCell>
            <TableCell>
              {t(
                `common.course-certificate.put-on-hold-modal.reasons.${changelog.payload.reason.toLocaleLowerCase()}`
              )}
            </TableCell>
            <TableCell>
              {t('dates.default', { date: changelog.payload.startDate })} /
              {t('dates.default', { date: changelog.payload.expireDate })}
            </TableCell>
            <TableCell>{changelog.payload.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CertificateHoldHistoryModal
