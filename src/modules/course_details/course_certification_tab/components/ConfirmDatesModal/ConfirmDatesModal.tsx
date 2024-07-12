import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  Alert,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

type PutOnHoldModalProps = {
  expireDate: Date
  dateTo: Date | undefined
  reasonSelected: string
  error: string | undefined
  onClose: () => void
}

const ConfirmDatesModal: React.FC<
  React.PropsWithChildren<PutOnHoldModalProps>
> = function ({ onClose, expireDate, dateTo, reasonSelected, error }) {
  const { t } = useTranslation()

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography>
          {t('common.course-certificate.email-notification')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('components.changelog-modal.reason')}</TableCell>
              <TableCell>{t('components.changelog-modal.new-dates')}</TableCell>
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
            <TableRow>
              <TableCell>
                {t(
                  `common.course-certificate.put-on-hold-modal.reasons.${reasonSelected.toLocaleLowerCase()}`,
                )}
              </TableCell>
              <TableCell>
                <Box display="flex" justifyContent="flex-start">
                  <Typography>
                    {t('dates.default', {
                      date: expireDate,
                    })}
                  </Typography>

                  <ArrowForwardIcon
                    style={{ color: theme.palette.grey[700] }}
                  />
                  <Typography>
                    {t('dates.default', { date: dateTo })}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          onClick={onClose}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained" color="primary" size="large">
          {t('common.course-certificate.confirm-dates')}
        </Button>
      </Grid>
    </Grid>
  )
}

export default ConfirmDatesModal
