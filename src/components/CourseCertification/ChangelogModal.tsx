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
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { Grade } from '@app/components/Grade'
import { CourseCertificateChangelog } from '@app/types'

export type ChangelogModalProps = {
  changelogs: CourseCertificateChangelog[]
}

const ChangelogModal: React.FC<ChangelogModalProps> = function ({
  changelogs,
}) {
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
          <TableCell>{t('components.changelog-modal.administrator')}</TableCell>
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
                <Avatar />
                <Typography variant="body2">
                  {changelog.author.fullName}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ verticalAlign: 'top' }}>
              {format(new Date(changelog.createdAt), 'PPpp')}
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <Grade grade={changelog.oldGrade} />
                <ArrowForwardIcon style={{ color: theme.palette.grey[700] }} />
                <Grade grade={changelog.newGrade} />
              </Box>
              <Box
                display="block"
                mt={2}
                p={2}
                sx={{ backgroundColor: 'grey.100' }}
              >
                <Typography variant="caption">{changelog.notes}</Typography>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ChangelogModal
