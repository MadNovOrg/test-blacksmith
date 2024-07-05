import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  Box,
  IconButton,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from '@mui/material'
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridValueFormatterParams,
} from '@mui/x-data-grid'
import { zonedTimeToUtc } from 'date-fns-tz'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'
import { ValidationError } from 'yup'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  Course_Pricing,
  SetCoursePricingScheduleMutation,
  SetCoursePricingScheduleMutationVariables,
  InsertCoursePricingScheduleMutation,
  InsertCoursePricingScheduleMutationVariables,
  DeleteCoursePricingScheduleMutation,
  DeleteCoursePricingScheduleMutationVariables,
} from '@app/generated/graphql'
import { MUTATION as DELETE_MUTATION } from '@app/queries/pricing/delete-course-pricing-schedule'
import { MUTATION as INSERT_MUTATION } from '@app/queries/pricing/insert-course-pricing-schedule'
import { MUTATION as UPDATE_MUTATION } from '@app/queries/pricing/set-course-pricing-schedule'
import theme from '@app/theme'

import { getCourseAttributes } from '../utils'

export type EditPriceModalProps = {
  pricing: Course_Pricing | null
  onClose: () => void
  onSave: () => void
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = uuidv4()
    setRows(oldRows => [
      ...oldRows,
      {
        id,
        effectiveFrom: '',
        effectiveTo: '',
        priceAmount: null,
        isNew: true,
      },
    ])
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'effectiveFrom' },
    }))
  }

  return (
    <GridToolbarContainer>
      <IconButton color="primary" onClick={handleClick}>
        <AddIcon />
      </IconButton>
    </GridToolbarContainer>
  )
}

export const EditPriceModal = ({
  pricing,
  onClose,
  onSave,
}: EditPriceModalProps) => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const [{ error: deleteCoursePricingError }, deleteCoursePricingSchedule] =
    useMutation<
      DeleteCoursePricingScheduleMutation,
      DeleteCoursePricingScheduleMutationVariables
    >(DELETE_MUTATION)

  const [{ error: insertCoursePricingError }, insertCoursePricingSchedule] =
    useMutation<
      InsertCoursePricingScheduleMutation,
      InsertCoursePricingScheduleMutationVariables
    >(INSERT_MUTATION)

  const [{ error: updateCoursePricingError }, updateCoursePricingSchedule] =
    useMutation<
      SetCoursePricingScheduleMutation,
      SetCoursePricingScheduleMutationVariables
    >(UPDATE_MUTATION)

  const initialRows: GridRowsProp = (pricing?.pricingSchedules || []).map(
    schedule => {
      return {
        id: schedule.id,
        effectiveFrom: schedule.effectiveFrom,
        effectiveTo: schedule.effectiveTo,
        priceAmount: schedule.priceAmount,
        isNew: false,
      }
    },
  )
  const [rows, setRows] = useState(initialRows)

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [errors, setErrors] = useState<string[]>([])
  const schema = yup.object({
    effectiveFrom: yup
      .string()
      .test(
        'validEffectiveFrom',
        t('pages.course-pricing.validation-errors.effective-from-valid'),
        value => {
          return value ? !isNaN(new Date(value).getDate()) : false
        },
      )
      .required(
        t('pages.course-pricing.validation-errors.effective-from-required'),
      ),
    effectiveTo: yup
      .string()
      .test(
        'validEffectiveTo',
        t('pages.course-pricing.validation-errors.effective-to-valid'),
        value => {
          return value ? !isNaN(new Date(value)?.getDate()) : false
        },
      )
      .test(
        'EffectiveToBeforeEffectiveFrom',
        t(
          'pages.course-pricing.validation-errors.effective-date-valid-interval',
        ),
        (value, context) =>
          value
            ? zonedTimeToUtc(new Date(value), 'GMT') >=
              zonedTimeToUtc(new Date(context?.parent.effectiveFrom), 'GMT')
            : false,
      )
      .required(
        t('pages.course-pricing.validation-errors.effective-to-required'),
      ),
    priceAmount: yup
      .number()
      .positive(
        t('pages.course-pricing.validation-errors.price-amount-positive'),
      )
      .required(
        t('pages.course-pricing.validation-errors.price-amount-required'),
      ),
  })

  const handleCloseSnackbar = () => setErrors([])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    const { data } = await deleteCoursePricingSchedule({
      id: id,
    })
    if (data) {
      setRows(rows.filter(row => row.id !== id))
      onSave()
    }
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find(row => row.id === id)
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const validateRow = (row: GridRowModel) => {
    try {
      return schema.validateSync(row, { abortEarly: false })
    } catch (err) {
      return err as ValidationError
    }
  }

  const processRowUpdate = async (
    rowAfterChange: GridRowModel,
    rowBeforeChange: GridRowModel,
  ) => {
    const validationResult = validateRow(rowAfterChange)
    if (validationResult instanceof ValidationError) {
      setErrors(validationResult.errors)
      return
    }
    if (rowBeforeChange.isNew) {
      const { data: createdCPS } = await insertCoursePricingSchedule({
        id: rowAfterChange.id,
        coursePricingId: pricing?.id,
        priceAmount: rowAfterChange.priceAmount,
        authorId: profile?.id,
        effectiveFrom: zonedTimeToUtc(
          new Date(rowAfterChange.effectiveFrom),
          'GMT',
        ),
        effectiveTo: zonedTimeToUtc(
          new Date(rowAfterChange.effectiveTo),
          'GMT',
        ),
      })
      const updatedRow = {
        ...rowAfterChange,
        isNew: false,
        id: createdCPS?.course_pricing_schedule?.id,
      }
      setRows(
        rows.map(row => (row.id === rowAfterChange.id ? updatedRow : row)),
      )
      if (createdCPS) {
        onSave()
      }
      return updatedRow
    } else {
      const { data } = await updateCoursePricingSchedule({
        id: rowAfterChange.id,
        coursePricingId: pricing?.id,
        oldPrice: rowBeforeChange.priceAmount,
        priceAmount: rowAfterChange.priceAmount,
        authorId: profile?.id,
        effectiveFrom: zonedTimeToUtc(
          new Date(rowAfterChange.effectiveFrom),
          'GMT',
        ),
        effectiveTo: zonedTimeToUtc(
          new Date(rowAfterChange.effectiveTo),
          'GMT',
        ),
      })

      if (data) onSave()
      const updatedRow = { ...rowAfterChange, isNew: false }
      setRows(
        rows.map(row => (row.id === rowAfterChange.id ? updatedRow : row)),
      )
      return updatedRow
    }
  }
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: 'effectiveFrom',
      headerName: t('pages.course-pricing.modal-cols-effective-from'),
      width: 180,
      editable: true,
      type: 'date',
      valueGetter: params => new Date(params.value),
      sortable: false,
    },
    {
      field: 'effectiveTo',
      headerName: t('pages.course-pricing.modal-cols-effective-to'),
      width: 180,
      editable: true,
      type: 'date',
      valueGetter: params => new Date(params.value),
      sortable: false,
    },
    {
      field: 'priceAmount',
      headerName: t('pages.course-pricing.cols-price'),
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return ''
        }
        return t('currency', { amount: params.value.toFixed(2) })
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('pages.course-pricing.modal-cols-actions'),
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label={t('pages.course-pricing.modal-save')}
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label={t('pages.course-pricing.modal-cancel')}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label={t('pages.course-pricing.modal-edit')}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label={t('pages.course-pricing.modal-delete')}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <Container>
      <Dialog
        open={true}
        onClose={onClose}
        title={
          <Typography variant="h3" ml={3} fontWeight={600} color="secondary">
            {t('pages.course-pricing.modal-individual-edit-title')}
          </Typography>
        }
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
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                disableColumnMenu
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                  toolbar: EditToolbar,
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
              />
              {errors.length ? (
                <Snackbar
                  open
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  sx={{
                    marginTop: '50px',
                  }}
                  onClose={handleCloseSnackbar}
                  autoHideDuration={6000}
                >
                  <Alert severity="error" onClose={handleCloseSnackbar}>
                    {errors.map((e, index) => (
                      <Typography key={index}>{e}</Typography>
                    ))}
                  </Alert>
                </Snackbar>
              ) : null}
            </Box>

            {insertCoursePricingError ||
            deleteCoursePricingError ||
            updateCoursePricingError ? (
              <Alert severity="error">
                {
                  (
                    insertCoursePricingError ??
                    deleteCoursePricingError ??
                    updateCoursePricingError
                  )?.message
                }
              </Alert>
            ) : null}

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
