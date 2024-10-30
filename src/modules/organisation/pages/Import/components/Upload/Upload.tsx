import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { LoadingButton } from '@mui/lab'
import { Box, Link, Typography, styled } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ImportStepsEnum as ImportSteps } from '@app/components/ImportSteps'
import { useImportContext } from '@app/components/ImportSteps/context'

import { necessaryColumns } from '../../utils'

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

export const Upload: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'import-organisations' })
  const { completeStep, goToStep, importConfigured, fileChosen } =
    useImportContext()
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
    importConfigured(necessaryColumns)
    completeStep(ImportSteps.CHOOSE)
    goToStep(ImportSteps.PREVIEW)
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t('steps.upload.title')}
      </Typography>

      <Trans
        i18nKey="steps.upload.description"
        t={t}
        components={[
          <Link
            key={0}
            underline="always"
            href="https://assets.teamteachhub.co.uk/Import_Organisations_Template.xlsx"
          />,
        ]}
      />

      <Box mt={4}>
        <LoadingButton
          component="label"
          variant="contained"
          loading={processing}
          startIcon={<CloudUploadIcon />}
        >
          {t('steps.upload.button-text')}
          <VisuallyHiddenInput
            data-testid="upload-orgs-file"
            type="file"
            accept=".xlsx"
            onChange={handleUploadChange}
          />
        </LoadingButton>
      </Box>
    </Box>
  )
}
