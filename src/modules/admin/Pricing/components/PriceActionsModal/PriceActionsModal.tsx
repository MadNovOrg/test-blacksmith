import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { Course_Pricing } from '@app/generated/graphql'
import { getCourseAttributes } from '@app/modules/admin/Pricing/utils'
import theme from '@app/theme'

import { CoursePricingDataGrid } from './components'

export type PriceActionsModalProps = {
  pricing: Course_Pricing | null
  onClose: () => void
  onSave: () => void
}

export const PriceActionsModal = ({
  pricing,
  onClose,
  onSave,
}: PriceActionsModalProps) => {
  const { t } = useTranslation()

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        slots={{
          Title: () => (
            <Typography variant="h3" ml={3} fontWeight={600} color="secondary">
              {t('pages.course-pricing.modal-individual-edit-title')}
            </Typography>
          ),
        }}
        maxWidth={800}
      >
        <Container>
          <form>
            <Typography sx={{ mb: 2 }} variant="body1" color="dimGrey.main">
              {t('pages.course-pricing.modal-individual-edit-description')}
            </Typography>

            <Typography variant="h4" fontWeight={500} mt={3} color="secondary">
              {t('pages.course-pricing.modal-price-label')}
            </Typography>

            <Box height={350} mt={3}>
              <CoursePricingDataGrid onSave={onSave} pricing={pricing} />
            </Box>

            <Typography
              variant="h4"
              fontWeight={500}
              mt={4}
              mb={1}
              color="secondary"
            >
              {t('pages.course-pricing.modal-details-label')}
            </Typography>

            <List sx={{ width: '100%', bgcolor: theme.palette.grey[100] }}>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-course')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {pricing?.level && t(`course-levels.${pricing?.level}`)}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-type')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {pricing?.type && t(`course-types.${pricing?.type}`)}
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText sx={{ width: '50%' }}>
                  <Typography color="dimGrey.main">
                    {t('pages.course-pricing.cols-attributes')}
                  </Typography>
                </ListItemText>
                <ListItemText sx={{ width: '50%' }}>
                  <Typography fontWeight={600} color="secondary">
                    {getCourseAttributes(t, pricing)}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </form>
        </Container>
      </Dialog>
    </Container>
  )
}
