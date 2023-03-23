import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Grade } from '@app/components/Grade'
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

const ChangelogModal: React.FC<React.PropsWithChildren<ChangelogModalProps>> =
  function ({ changelogs }) {
    const { t } = useTranslation()
    const theme = useTheme()

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
            <TableCell>
              {t('components.changelog-modal.administrator')}
            </TableCell>
            <TableCell>{t('components.changelog-modal.date')}</TableCell>
            <TableCell>{t('components.changelog-modal.change')}</TableCell>
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
              <TableCell sx={{ verticalAlign: 'top' }}>
                {t('dates.fullDateTime', { date: changelog.createdAt })}
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Grade grade={changelog.payload.oldGrade} />
                  <ArrowForwardIcon
                    style={{ color: theme.palette.grey[700] }}
                  />
                  <Grade grade={changelog.payload.newGrade} />
                </Box>
                <Box
                  display="block"
                  mt={2}
                  p={2}
                  sx={{ backgroundColor: 'grey.100' }}
                >
                  <Typography variant="caption">
                    {changelog.payload.notes}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

export default ChangelogModal
