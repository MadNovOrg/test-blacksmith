import InfoIcon from '@mui/icons-material/Info'
import {
  TableRow,
  TableCell,
  Box,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { Ellipsize } from '@app/components/Ellipsize'
import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import { Promo_Code } from '@app/generated/graphql'
import { CourseLevel } from '@app/types'

import { getPromoCodeStatus, getPromoCodeStatusColor } from '../helpers'

type Props = {
  promo: Partial<Promo_Code>
}

export const Row: React.FC<Props> = ({ promo }) => {
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
      </TableCell>

      <TableCell width="140" align="center">
        {`${promo.amount}${typeSuffix}`}
      </TableCell>

      <TableCell>
        {!promo.levels.length && !promo.courses.length
          ? t('pages.promoCodes.appliesTo-ALL')
          : null}
        {promo.levels.length ? (
          <>
            <Ellipsize
              text={promo.levels
                .map((l: CourseLevel) => t(`course-levels.${l}`))
                .join(', ')}
              len={25}
            />
            <Typography variant="body2">
              {t('pages.promoCodes.appliesTo-LEVELS')}
            </Typography>
          </>
        ) : null}
        {promo.courses.length ? (
          <>
            <Ellipsize text={promo.courses.join(', ')} len={25} />
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
          />
        </Tooltip>
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          label={t(`pages.promoCodes.status-${status}`)}
          sx={{
            fontSize: 11,
            backgroundColor: getPromoCodeStatusColor(status),
          }}
        />
      </TableCell>
    </TableRow>
  )
}
