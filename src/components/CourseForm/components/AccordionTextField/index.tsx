import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Typography, Accordion, Button, Box } from '@mui/material'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmDialog } from '@app/components/ConfirmDialog'
import { RichTextEditor } from '@app/components/RichTextEditor'
import theme from '@app/theme'
import { noop } from '@app/util'

type Props = {
  title: string
  confirmResetTitle: string
  confirmResetMessage: string
  value?: string
  defaultValue?: string
  maxLength?: number
  editMode?: boolean
  onSave?: (value?: string) => void
}

export const InstructionAccordionField: React.FC<Props> = ({
  title,
  confirmResetTitle,
  confirmResetMessage,
  value,
  maxLength,
  defaultValue = '',
  editMode = true,
  onSave = noop,
}) => {
  const { t } = useTranslation()
  const [editorValue, setEditorValue] = useState(value)
  const [editable, setEditable] = useState(editMode)
  const [resetValueToDefault, setResetValueToDefault] = useState(false)

  const resetValueHandler = () => {
    setResetValueToDefault(true)
  }

  const confirmResettingHandler = () => {
    setResetValueToDefault(false)
    setEditorValue(defaultValue)
    onSave(defaultValue)
    setEditable(false)
  }

  const cancelResettingHandler = () => {
    setResetValueToDefault(false)
  }

  const cancelHandler = () => {
    setEditable(false)
  }

  const saveChangesHandler = () => {
    setEditable(false)
    onSave(editorValue)
  }

  const editFiled = (
    <>
      <RichTextEditor
        value={value}
        onChange={setEditorValue}
        maxLength={maxLength}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 1,
          columnGap: 2,
        }}
      >
        {defaultValue ? (
          <Button variant="text" onClick={resetValueHandler}>
            {t('components.course-form.reset-instructions-button')}
          </Button>
        ) : null}
        <Button variant="outlined" onClick={cancelHandler}>
          {t('common.cancel')}
        </Button>

        <Button variant="contained" onClick={saveChangesHandler}>
          {t('components.course-form.save-button-text')}
        </Button>
      </Box>
      {resetValueToDefault ? (
        <ConfirmDialog
          open={resetValueToDefault}
          title={confirmResetTitle}
          message={confirmResetMessage}
          onCancel={cancelResettingHandler}
          onOk={confirmResettingHandler}
        />
      ) : null}
    </>
  )

  const readOnlyField = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        columnGap: 1,
      }}
    >
      <RichTextEditor value={value} editable={false} maxLength={maxLength} />
      <Button
        variant="text"
        size="small"
        endIcon={<EditIcon />}
        onClick={() => setEditable(editable => !editable)}
      >
        {t('common.edit')}
      </Button>
    </Box>
  )

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderBottom: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ marginTop: 1 }}>{editable ? editFiled : readOnlyField}</Box>
      </AccordionDetails>
    </Accordion>
  )
}
