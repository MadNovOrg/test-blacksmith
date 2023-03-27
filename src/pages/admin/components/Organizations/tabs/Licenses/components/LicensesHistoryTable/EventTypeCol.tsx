import InfoIcon from '@mui/icons-material/Info'
import { Link, Tooltip, Typography } from '@mui/material'
import React from 'react'

import {
  Go1_History_Events_Enum,
  Go1_Licenses_History,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

type Props = {
  item: Omit<Go1_Licenses_History, 'org_id' | 'organization'>
}

export const EventTypeCol: React.FC<React.PropsWithChildren<Props>> = ({
  item,
}) => {
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses.table')

  switch (item.event) {
    case Go1_History_Events_Enum.LicensesAdded: {
      return (
        <>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            {item.payload?.invoiceId}
            {item.payload?.note ? (
              <Tooltip title={item.payload.note}>
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            ) : null}
          </Typography>
          <Typography variant="body2">
            <Link href={`/profile/${item.payload?.invokedById}`}>
              {t('added-by', { fullName: item.payload.invokedBy })}
            </Link>
          </Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicensesRemoved: {
      return (
        <>
          {item.payload?.invoiceId ? (
            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {item.payload?.invoiceId}
              {item.payload?.note ? (
                <Tooltip title={item.payload.note}>
                  <InfoIcon fontSize="small" color="primary" />
                </Tooltip>
              ) : null}
            </Typography>
          ) : null}

          <Typography
            variant={!item.payload?.invoiceId ? 'body1' : 'body2'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Link href={`/profile/${item.payload?.invokedById}`}>
              {t('removed-by', { fullName: item.payload.invokedBy })}
            </Link>
            {item.payload?.note && !item.payload?.invoiceId ? (
              <Tooltip title={item.payload.note}>
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            ) : null}
          </Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicensesReleased: {
      return (
        <>
          <Typography sx={{ mb: 1 }}>{t('released-licenses')}</Typography>
          <Typography variant="body2">
            <Link href={`/courses/${item.payload?.courseId}/details`}>
              {item.payload?.courseCode}
            </Link>
          </Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicenseIssued: {
      return (
        <Typography>
          <Link href={`/courses/${item.payload?.courseId}/details`}>
            {item.payload?.courseCode}
          </Link>
        </Typography>
      )
    }

    case Go1_History_Events_Enum.LicensesPurchased: {
      return (
        <>
          <Typography sx={{ mb: 1 }}>{item.payload?.invoiceId}</Typography>
          <Typography variant="body2">{t('purchased')}</Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicenseRevoked: {
      return (
        <Typography>
          <Link href={`/profile/${item.payload?.invokedById}`}>
            {t('revoked-by', { fullName: item.payload?.invokedBy })}
          </Link>
        </Typography>
      )
    }

    case Go1_History_Events_Enum.LicensesReserved: {
      return (
        <>
          <Typography sx={{ mb: 1 }}>
            <Link href={`/courses/${item.payload?.courseId}/details`}>
              {item.payload?.courseCode}
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href={`/profile/${item.payload?.invokedById}`}>
              {t('reserved-by', { fullName: item.payload.invokedBy })}
            </Link>
          </Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicensesCancelled: {
      return (
        <>
          <Typography sx={{ mb: 1 }}>
            <Link href={`/courses/${item.payload?.courseId}/details`}>
              {item.payload?.courseCode}
            </Link>
          </Typography>
          <Typography variant="body2">{t('licenses-cancelled')}</Typography>
        </>
      )
    }

    case Go1_History_Events_Enum.LicensesDeclined: {
      return (
        <>
          <Typography sx={{ mb: 1 }}>
            <Link href={`/courses/${item.payload?.courseId}/details`}>
              {item.payload?.courseCode}
            </Link>
          </Typography>
          <Typography variant="body2">{t('licenses-declined')}</Typography>
        </>
      )
    }

    default: {
      return null
    }
  }
}
