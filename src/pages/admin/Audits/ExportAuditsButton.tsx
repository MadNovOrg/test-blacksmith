import { LoadingButton } from '@mui/lab'
import { saveAs } from 'file-saver'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { utils as xlsxUtils, write } from 'xlsx'

type Props = {
  prefix: string
  renderData: () => string[][]
}

export const ExportAuditsButton: React.FC<Props> = ({ prefix, renderData }) => {
  const { t } = useTranslation()

  const exportAudits = useCallback(() => {
    const wb = xlsxUtils.book_new()
    const ws = xlsxUtils.aoa_to_sheet(renderData())
    xlsxUtils.book_append_sheet(wb, ws, 'Events')
    const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' })
    saveAs(new Blob([buffer]), `${prefix}-${new Date().toISOString()}.xlsx`)
  }, [prefix, renderData])

  return (
    <LoadingButton variant="contained" onClick={exportAudits}>
      {t('common.export')}
    </LoadingButton>
  )
}
