import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'

import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'

export const OrgResourcePacksPricingCourseDetailsSection: React.FC = () => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-course-details-section',
  )
  const { pricing } = useResourcePacksPricingContext()

  if (!pricing) return null

  const attributesColumn = (
    reaccred: boolean,
    courseType: Course_Type_Enum,
  ) => {
    if (courseType === Course_Type_Enum.Indirect)
      return t('alias.non-reaccreditation') + ', ' + t('alias.reaccreditation')
    return t(`alias.${reaccred ? 'reaccreditation' : 'non-reaccreditation'}`)
  }
  return (
    <Box>
      <Typography variant="h4" fontWeight={500} mt={4} mb={1} color="secondary">
        {t('title')}
      </Typography>
      <List sx={{ width: '100%', bgcolor: theme.palette.grey[100] }}>
        <ListItem alignItems="flex-start">
          <ListItemText sx={{ width: '50%' }}>
            <Typography color="dimGrey.main">
              {t('columns.course-level')}
            </Typography>
          </ListItemText>
          <ListItemText sx={{ width: '50%' }}>
            <Typography fontWeight={600} color="secondary">
              {_t(`course-levels.${pricing.courseLevel}`)}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText sx={{ width: '50%' }}>
            <Typography color="dimGrey.main">
              {t('columns.course-type')}
            </Typography>
          </ListItemText>
          <ListItemText sx={{ width: '50%' }}>
            <Typography fontWeight={600} color="secondary">
              {_t(`course-types.${pricing.courseType}`)}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText sx={{ width: '50%' }}>
            <Typography color="dimGrey.main">
              {t('columns.attributes')}
            </Typography>
          </ListItemText>
          <ListItemText sx={{ width: '50%' }}>
            <Typography fontWeight={600} color="secondary">
              {attributesColumn(pricing.reaccred, pricing.courseType)}
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  )
}
