import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import React, { useState } from 'react'
import { Trans } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Course_Level_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { TransferTermsTable } from '@app/modules/transfer_participant/components/TransferTermsTable'

import { ACTION_TYPE } from './ModifyAttendanceModal'

export const ParticipantTransferInfo: React.FC<
  React.PropsWithChildren<{
    startDate: Date
    courseLevel: Course_Level_Enum
    onAgreeTerms: (actionType: ACTION_TYPE, state: boolean) => void
  }>
> = ({ startDate, courseLevel, onAgreeTerms }) => {
  const { t } = useScopedTranslation(
    'pages.course-details.change-my-attendance.transfer-info',
  )
  const { acl } = useAuth()
  const [agreeTerms, setAgreeTerms] = useState(false)

  const onAgreeTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setAgreeTerms(isChecked)
    onAgreeTerms(ACTION_TYPE.TRANSFER, isChecked)
  }

  return (
    <Box width={750} height={350}>
      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        <Trans
          i18nKey="pages.course-details.change-my-attendance.transfer-info.alert-message"
          components={{
            termsOfBusinessLink: (
              <Link
                target="_blank"
                rel="noreferrer"
                href={`${import.meta.env.VITE_BASE_WORDPRESS_URL}${
                  acl.isUK()
                    ? '/policies-procedures/terms-of-business/'
                    : '/au/terms-conditions-au-nz/'
                }`}
              />
            ),
          }}
        />
      </Alert>
      <Box mt={2}>
        <TransferTermsTable startDate={startDate} courseLevel={courseLevel} />
      </Box>

      <Box mt={4}>
        <FormControlLabel
          control={
            <Checkbox checked={agreeTerms} onChange={onAgreeTermsChange} />
          }
          label={t('terms-notice')}
        />
      </Box>
    </Box>
  )
}
