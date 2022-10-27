import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { TFunction } from 'i18next'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { InferType } from 'yup'

import { Dialog } from '@app/components/Dialog'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { yup } from '@app/schemas'

function schema(t: TFunction) {
  return yup.object({
    reason: yup.string().required(t('error-reason-required-field')),
  })
}

type FormValues = InferType<ReturnType<typeof schema>>
export type CourseDiff = {
  type: 'date' | 'venue'
  oldValue: string
  newValue: string
}

type Props = {
  onCancel: () => void
  onConfirm: (data: FormValues) => void
  diff: CourseDiff[]
  open?: boolean
}

export const ReviewChangesModal: React.FC<Props> = ({
  onCancel,
  onConfirm,
  diff,
  open = false,
  children,
}) => {
  const { t } = useScopedTranslation('pages.edit-course.review-changes-modal')

  const { register, formState, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema(t)),
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<FormValues> = data => {
    onConfirm(data)
    onCancel()
  }

  return (
    <Dialog
      open={open}
      maxWidth={700}
      title={
        <Typography variant="h3" color="grey.800">
          {t('title')}
        </Typography>
      }
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {children ? <Box mb={2}>{children}</Box> : null}
        <Typography color="dimGrey.main" mb={2}>
          {t('description')}
        </Typography>

        <Table data-testid="transfer-terms-table" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('col-property')}</TableCell>
              <TableCell>{t('col-old-value')}</TableCell>
              <TableCell>{t('col-new-value')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diff.map(d => (
              <TableRow key={d.type}>
                <TableCell>{t(`col-${d.type}-type`)}</TableCell>
                <TableCell
                  sx={{ textDecoration: 'line-through', color: 'dimGrey.main' }}
                >
                  {d.oldValue}
                </TableCell>
                <TableCell>{d.newValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TextField
          placeholder={t('reason-field-placeholder')}
          fullWidth
          variant="filled"
          error={Boolean(formState.errors.reason?.message)}
          helperText={formState.errors.reason?.message}
          {...register('reason')}
        />

        <Box display="flex" justifyContent="space-between" mt={5}>
          <Button onClick={onCancel}>{t('cancel-btn-text')}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formState.isValid}
          >
            {t('confirm-btn-text')}
          </Button>
        </Box>
      </form>
    </Dialog>
  )
}
