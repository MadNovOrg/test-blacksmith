import { LoadingButton } from '@mui/lab'
import { saveAs } from 'file-saver'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { utils as xlsxUtils, write } from 'xlsx'

type Props = {
  prefix: string
  renderData: () => string[][] | PromiseLike<string[][]>
}

export const ExportAuditsButton: React.FC<React.PropsWithChildren<Props>> = ({
  prefix,
  renderData,
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const exportAudits = useCallback(async () => {
    setIsLoading(true)

    try {
      const arraysOfArrays = await renderData()
      const wb = xlsxUtils.book_new()
      const ws = xlsxUtils.aoa_to_sheet(arraysOfArrays)
      xlsxUtils.book_append_sheet(wb, ws, 'Events')
      const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' })
      saveAs(new Blob([buffer]), `${prefix}-${new Date().toISOString()}.xlsx`)
    } finally {
      setIsLoading(false)
    }
  }, [prefix, renderData])

  return (
    <LoadingButton
      loading={isLoading}
      variant="contained"
      onClick={exportAudits}
    >
      {t('common.export')}
    </LoadingButton>
  )
}
