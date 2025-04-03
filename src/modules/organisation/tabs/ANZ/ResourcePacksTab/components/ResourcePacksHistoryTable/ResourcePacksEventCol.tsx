import InfoIcon from '@mui/icons-material/Info'
import { Grid, Link, Tooltip, Typography } from '@mui/material'

import { useAuth } from '@app/context/auth'
import {
  GetOrgResourcePacksHistoryQuery,
  Resource_Packs_Events_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

export type ResourcePacksEventColProps = {
  event: Pick<
    GetOrgResourcePacksHistoryQuery['history'][number],
    'event' | 'payload'
  >
}

export const ResourcePacksEventCol = ({
  event,
}: ResourcePacksEventColProps) => {
  const { acl } = useAuth()

  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-packs.table',
  )

  if (
    [
      Resource_Packs_Events_Enum.ResourcePacksAdded,
      Resource_Packs_Events_Enum.ResourcePacksPurchased,
      Resource_Packs_Events_Enum.ResourcePacksRemoved,
      Resource_Packs_Events_Enum.ResourcePacksReserved,
    ].includes(event.event)
  ) {
    const invokedByCopies = {
      [Resource_Packs_Events_Enum.ResourcePacksAdded]: t('added-by', {
        fullName: event.payload?.invokedByName,
      }),
      [Resource_Packs_Events_Enum.ResourcePacksPurchased]: t('purchased-by', {
        fullName: event.payload?.invokedByName,
      }),
      [Resource_Packs_Events_Enum.ResourcePacksRemoved]: t('removed-by', {
        fullName: event.payload?.invokedByName,
      }),
      [Resource_Packs_Events_Enum.ResourcePacksReserved]: t('reserved-by', {
        fullName: event.payload?.invokedByName,
      }),
    }

    const InvokedByUser = () => {
      return (
        <Typography variant="body2">{invokedByCopies[event.event]}</Typography>
      )
    }
    return (
      <Grid container direction={'column'}>
        <Grid
          container
          item
          sx={{
            alignItems: 'center',
            gap: 0.5,
            justifyContent: 'start',
          }}
        >
          {event.payload?.invoiceNumber ? (
            <Typography>{event.payload?.invoiceNumber}</Typography>
          ) : null}

          {event.payload?.note ? (
            <Tooltip title={event.payload.note}>
              <InfoIcon
                color="primary"
                data-testid="note-icon"
                fontSize="small"
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ) : null}
        </Grid>
        {acl.isInternalUser() ? (
          <Link href={`/profile/${event.payload?.invokedById}`}>
            <InvokedByUser />
          </Link>
        ) : (
          <InvokedByUser />
        )}
      </Grid>
    )
  }

  return <>{event.event}</>
}
