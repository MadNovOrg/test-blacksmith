import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { LoadingButton } from '@mui/lab'
import { Box, Typography, styled } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useImportContext } from '../../context/ImportProvider'
import { ImportSteps } from '../../types'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export const ChooseFile: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import-users' })
  const { completeStep, goToStep, fileChosen } = useImportContext()
  const [processing, setProcessing] = useState(false)

  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return
    }

    setProcessing(true)

    const file = e.target.files[0]

    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => {
        reader.abort()
        reject()
      }
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(btoa(reader.result))
        } else {
          throw new Error('Error reading the file.')
        }
      }
      reader.readAsBinaryString(file)
    })

    setProcessing(false)

    fileChosen(data)
    completeStep(ImportSteps.CHOOSE)
    goToStep(ImportSteps.CONFIGURE)
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('steps.choose.title')}
      </Typography>

      <Typography>{t('steps.choose.description')}</Typography>

      <Box mt={4}>
        <LoadingButton
          component="label"
          variant="contained"
          loading={processing}
          startIcon={<CloudUploadIcon />}
        >
          {t('steps.choose.button-text')}
          <VisuallyHiddenInput
            type="file"
            accept=".xlsx"
            onChange={handleUploadChange}
          />
        </LoadingButton>
      </Box>
    </Box>
  )
}
