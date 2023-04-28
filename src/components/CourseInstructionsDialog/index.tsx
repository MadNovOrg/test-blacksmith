import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { RichTextEditor } from '@app/components/RichTextEditor'

import { Content } from './components/Content'
import { Title } from './components/Title'

type Props = {
  open: boolean
  onCancel: () => void
  specialInstructions?: string
  parkingInstructions?: string
  showParkingInstructions?: boolean
}

export const CourseInstructionsDialog: React.FC<Props> = ({
  open,
  onCancel,
  specialInstructions = '',
  parkingInstructions = '',
  showParkingInstructions = true,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onCancel} minWidth={500}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Title>
          {t('components.course-instructions-dialog.special-title')}
        </Title>
        <Content>
          <RichTextEditor value={specialInstructions} editable={false} />
        </Content>
        {showParkingInstructions && (
          <>
            <Title sx={{ marginTop: 3 }}>
              {t('components.course-instructions-dialog.parking-title')}
            </Title>
            <Content>
              <RichTextEditor value={parkingInstructions} editable={false} />
            </Content>
          </>
        )}
      </Box>
    </Dialog>
  )
}
