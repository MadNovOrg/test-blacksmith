import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Snackbar, Alert, Typography } from '@mui/material'
import {
  GridColDef,
  GridValueFormatterParams,
  GridRowModes,
  GridActionsCellItem,
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
} from '@mui/x-data-grid'
import { zonedTimeToUtc } from 'date-fns-tz'
import { t } from 'i18next'
import { useCallback, useEffect, useState } from 'react'
import { useClient } from 'urql'
import { ValidationError } from 'yup'

import { useAuth } from '@app/context/auth'
import {
  Course_Pricing,
  GetCoursesWithPricingQuery,
  GetCoursesWithPricingQueryVariables,
} from '@app/generated/graphql'
import { CoursesWithAvailablePricing } from '@app/modules/admin/Pricing/components'
import {
  PricingDetails,
  useDeleteCoursePricing,
  useInsertPricingEntry,
  useUpdatePricingEntry,
} from '@app/modules/admin/Pricing/hooks'
import { GET_COURSES_WITH_AVAILABLE_PRICING_QUERY } from '@app/modules/admin/Pricing/queries'
import {
  getInitialRows,
  getSchema,
  validationAsMessages,
  yyyyMMddDateFormat,
} from '@app/modules/admin/Pricing/utils'

import { EditPriceToolbar } from '..'

export const CoursePricingDataGrid = ({
  onSave,
  pricing,
}: {
  onSave: () => void
  pricing: Course_Pricing | null
}) => {
  const client = useClient()
  const { profile } = useAuth()
  const [{ error: deleteCoursePricingError }, deleteCoursePricingSchedule] =
    useDeleteCoursePricing()
  const [{ error: insertCoursePricingError }, insertCoursePricingSchedule] =
    useInsertPricingEntry()
  const { error: updateCoursePricingError, updatePricingSchedule } =
    useUpdatePricingEntry()

  const [rows, setRows] = useState(getInitialRows(pricing?.pricingSchedules))
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [errors, setErrors] = useState<string[]>([])
  const [courses, setCourses] = useState<GetCoursesWithPricingQuery>()
  const [ctaOption, setCTAOption] = useState<'approve' | 'cancel' | undefined>(
    undefined,
  )

  const [pricingDetails, setPricingDetails] = useState<PricingDetails>()

  const validateRow = useCallback(
    (row: GridRowModel) => {
      try {
        return getSchema({
          pricings: pricing?.pricingSchedules,
          isNewPricing: row.isNew,
          rowId: row.id,
        }).validateSync(row, {
          abortEarly: false,
        })
      } catch (err) {
        return err as ValidationError
      }
    },
    [pricing?.pricingSchedules],
  )
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

  const processRowUpdate = async (
    rowAfterChange: GridRowModel,
    rowBeforeChange: GridRowModel,
  ) => {
    setCourses(undefined)
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
        effectiveTo:
          rowAfterChange.effectiveTo !== null
            ? zonedTimeToUtc(new Date(rowAfterChange.effectiveTo), 'GMT')
            : null,
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
      const formattedEffectiveFromAfterChange = yyyyMMddDateFormat(
        new Date(rowAfterChange.effectiveFrom),
      )
      const formattedEffectiveFromBeforeChange = yyyyMMddDateFormat(
        new Date(rowBeforeChange.effectiveFrom),
      )
      const formattedEffectiveToAfterChange = yyyyMMddDateFormat(
        new Date(rowAfterChange.effectiveTo),
      )
      const formattedEffectiveToBeforeChange = yyyyMMddDateFormat(
        new Date(rowBeforeChange.effectiveTo),
      )
      if (
        rowBeforeChange.priceAmount !== rowAfterChange.priceAmount &&
        formattedEffectiveFromAfterChange ===
          formattedEffectiveFromBeforeChange &&
        formattedEffectiveToAfterChange === formattedEffectiveToBeforeChange
      ) {
        const data = await updatePricingSchedule({
          rowAfterChange,
          rowBeforeChange,
          pricing,
          authorId: profile?.id ?? '',
        })
        if (data) onSave()
        const updatedRow = { ...rowAfterChange, isNew: false }
        setRows(
          rows.map(row => (row.id === rowAfterChange.id ? updatedRow : row)),
        )
        return updatedRow
      } else {
        const effectiveFromBeforeChange = rowBeforeChange.effectiveFrom
        const effectiveToBeforeChange = rowBeforeChange.effectiveTo
        client
          .query<
            GetCoursesWithPricingQuery,
            GetCoursesWithPricingQueryVariables
          >(GET_COURSES_WITH_AVAILABLE_PRICING_QUERY, {
            pricingStartBeforeChange: effectiveFromBeforeChange,
            pricingEndBeforeChange:
              effectiveToBeforeChange ??
              yyyyMMddDateFormat(new Date(2199, 11, 31)),
            pricingEndAfterChange: rowAfterChange.effectiveTo,
            pricingStartAfterChange: rowAfterChange.effectiveFrom,
            where: {
              type: { _eq: pricing?.type },
              level: { _eq: pricing?.level },
              go1Integration: { _eq: pricing?.blended },
              reaccreditation: { _eq: pricing?.reaccreditation },
            },
          })
          .toPromise()
          .then(async ({ data }) => {
            setCourses(data)
            if (!data?.course_aggregate.aggregate?.count) {
              const data = await updatePricingSchedule({
                rowAfterChange,
                rowBeforeChange,
                pricing,
                authorId: profile?.id ?? '',
              })
              if (data) onSave()
            } else {
              setPricingDetails({
                rowAfterChange,
                rowBeforeChange,
                pricing,
                authorId: profile?.id ?? '',
              })
            }
          })
        const updatedRow = { ...rowAfterChange, isNew: false }
        setRows(
          rows.map(row => (row.id === rowAfterChange.id ? updatedRow : row)),
        )
        return updatedRow
      }
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
      valueGetter: params => (params.value ? new Date(params.value) : null),
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

  const errorMessage = (
    insertCoursePricingError ??
    deleteCoursePricingError ??
    updateCoursePricingError
  )?.message

  useEffect(() => {
    ;(async () => {
      if (ctaOption === 'approve' && pricingDetails) {
        const pricingData = await updatePricingSchedule({
          rowAfterChange: pricingDetails?.rowAfterChange,
          rowBeforeChange: pricingDetails?.rowAfterChange,
          pricing: pricingDetails?.pricing,
          authorId: profile?.id ?? '',
        })
        if (pricingData) onSave()
      }
    })()
  }, [ctaOption, onSave, pricingDetails, profile, updatePricingSchedule])

  return (
    <>
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
          toolbar: EditPriceToolbar,
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
            {[...new Set([...errors, ...validationAsMessages.values()])]
              .filter(Boolean)
              .map((e, index) => (
                <Typography key={index}>{e}</Typography>
              ))}
          </Alert>
        </Snackbar>
      ) : null}

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {courses?.course_aggregate.aggregate?.count ? (
        <CoursesWithAvailablePricing
          courses={courses}
          showCTA={true}
          setCTAOption={setCTAOption}
        />
      ) : null}
    </>
  )
}
