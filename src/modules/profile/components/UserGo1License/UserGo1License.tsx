import { CheckCircle } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Typography } from '@mui/material'
import { differenceInCalendarMonths } from 'date-fns'
import { useMutation } from 'urql'

import {
  DeleteGo1LicenseMutation,
  DeleteGo1LicenseMutationVariables,
  Go1_Licenses,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import DELETE_GO1_LICENSE from '@app/queries/go1-licensing/delete-go1-license'

export type Go1LicenseInfo = Pick<
  Go1_Licenses,
  'id' | 'expireDate' | 'enrolledOn'
>

type Props = {
  license: Go1LicenseInfo
  editable: boolean
  onDeleted?: () => void
}

export const UserGo1License: React.FC<React.PropsWithChildren<Props>> = ({
  license,
  editable,
  onDeleted,
}) => {
  const { id, enrolledOn, expireDate } = license

  const { t, _t } = useScopedTranslation('pages.my-profile')
  const [{ error, fetching: deletingLicense }, deleteGo1Licence] = useMutation<
    DeleteGo1LicenseMutation,
    DeleteGo1LicenseMutationVariables
  >(DELETE_GO1_LICENSE)

  const expiresInMonths = differenceInCalendarMonths(
    new Date(expireDate),
    new Date(),
  )

  const deleteLicense = async () => {
    await deleteGo1Licence({ id })
    if (typeof onDeleted === 'function' && !error) {
      onDeleted()
    }
  }

  return (
    <Box data-testid={`go1-license-${id}`}>
      <Typography variant="subtitle2" mb={1}>
        {t('bl-license-title')}
      </Typography>

      <Box bgcolor="common.white" p={3} borderRadius={1}>
        {error ? (
          <Alert sx={{ mb: 2 }} severity="error">
            {t('bl-license-deleting-error')}
          </Alert>
        ) : null}

        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography mb={2} data-testid="enrolled-on">
              {t('bl-license-enrolled-on', {
                date: _t('dates.defaultShort', { date: new Date(enrolledOn) }),
              })}
            </Typography>
            <Typography
              fontWeight={600}
              display="flex"
              data-testid="expires-in"
            >
              <CheckCircle color="success" sx={{ mr: 1 }} />{' '}
              {t('bl-license-expires-in', {
                count: expiresInMonths,
                date: _t('dates.defaultShort', { date: new Date(expireDate) }),
                months: expiresInMonths,
              })}
            </Typography>
          </Box>

          {editable ? (
            <Box>
              <LoadingButton
                variant="outlined"
                onClick={deleteLicense}
                loading={deletingLicense}
              >
                {t('bl-license-remove')}
              </LoadingButton>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}
