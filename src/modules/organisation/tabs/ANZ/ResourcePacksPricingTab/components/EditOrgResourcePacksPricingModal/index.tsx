import { Container, Typography } from '@mui/material'
import React from 'react'

import { Dialog } from '@app/components/dialogs'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { OrgResourcePacksPricingCourseDetailsSection } from '../OrgResourcePacksPricingCourseDetailsSection'
import { OrgResourcePacksPricingTable } from '../OrgResourcePacksPricingsTable'

export type Props = {
  onClose: () => void
}

export const EditOrgResourcePacksPricingModal: React.FC<Props> = ({
  onClose,
}) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal',
  )

  return (
    <Container data-testid="edit-org-resource-packs-pricing-modal">
      <Dialog
        open={true}
        onClose={onClose}
        minWidth={600}
        noPaddings={true}
        slots={{
          Title: () => (
            <Typography variant="h3" ml={3} fontWeight={600} color="secondary">
              {t('title')}
            </Typography>
          ),
        }}
      >
        <OrgResourcePacksPricingTable />
        <OrgResourcePacksPricingCourseDetailsSection />
      </Dialog>
    </Container>
  )
}
