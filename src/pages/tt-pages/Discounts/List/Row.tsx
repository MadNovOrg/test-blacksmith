import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Chip,
  Link,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Ellipsize } from '@app/components/Ellipsize'
import {
  GetPromoCodesQuery,
  Promo_Code_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'
import { Avatar } from '@app/modules/profile/components/Avatar'

import { DISCOUNT_STATUS_COLOR, getPromoCodeStatus } from '../helpers'

import { ApproveDeny } from './ApproveDeny'

type Props = {
  promo: GetPromoCodesQuery['promoCodes'][number]
  showApprove?: boolean
  onAction: () => Promise<unknown> | void
}

export const Row: React.FC<React.PropsWithChildren<Props>> = ({
  promo,
  showApprove = false,
  onAction,
}) => {
  const { t } = useTranslation()

  const typeSuffix = useMemo(() => {
    if (promo.type === Promo_Code_Type_Enum.Percent) return '%'
    if (promo.type === Promo_Code_Type_Enum.FreePlaces) return 'x'
    return ''
  }, [promo.type])

  const status = getPromoCodeStatus(promo)

  return (
    <TableRow key={promo.id}>
      <TableCell>
        <Link href={`/admin/discounts/edit/${promo.id}`}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <Ellipsize text={promo.code} len={20} />
            {promo.description ? (
              <Tooltip title={promo.description} placement="top" arrow={true}>
                <InfoIcon fontSize="small" sx={{ ml: 1, fill: '#0D2860CC' }} />
              </Tooltip>
            ) : null}
          </Box>
        </Link>
      </TableCell>

      <TableCell width="140" align="center">
        {`${promo.amount}${typeSuffix}`}
      </TableCell>

      <TableCell>
        {!promo.levels.length && !promo.courses?.length
          ? t('pages.promoCodes.appliesTo-ALL')
          : null}
        {promo.levels.length ? (
          <>
            <Ellipsize
              text={promo.levels
                .map((l: Course_Level_Enum) => t(`course-levels.${l}`))
                .join(', ')}
              len={25}
            />
            <Typography variant="body2">
              {t('pages.promoCodes.appliesTo-LEVELS')}
            </Typography>
          </>
        ) : null}
        {promo.courses?.length ? (
          <>
            <Ellipsize
              text={Object.values(
                promo.courses.map(s => s.course?.course_code) || ''
              ).join(', ')}
              len={25}
            />
            <Typography variant="body2">
              {t('pages.promoCodes.appliesTo-COURSES')}
            </Typography>
          </>
        ) : null}
      </TableCell>

      <TableCell>{t('dates.default', { date: promo.validFrom })}</TableCell>

      <TableCell>
        {promo.validTo
          ? t('dates.default', { date: promo.validTo })
          : t('pages.promoCodes.neverExpires')}
      </TableCell>

      <TableCell align="center">
        <Tooltip
          title={promo.creator?.fullName ?? ''}
          placement="right"
          arrow={true}
        >
          <Avatar
            name={promo.creator?.fullName ?? ''}
            size={32}
            sx={{ display: 'inline-flex' }}
            src={promo.creator?.avatar ?? ''}
          />
        </Tooltip>
      </TableCell>

      <TableCell>
        {showApprove ? (
          <ApproveDeny promoCode={promo} onAction={onAction} />
        ) : (
          <Chip
            size="small"
            label={t(`pages.promoCodes.status-${status}`)}
            color={DISCOUNT_STATUS_COLOR[status]}
            sx={{
              fontSize: 11,
            }}
          />
        )}
      </TableCell>
    </TableRow>
  )
}
