import AddIcon from '@mui/icons-material/Add'
import { IconButton } from '@mui/material'
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

type EditPriceToolbarProps = {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void
}

export const EditPriceToolbar = (props: EditPriceToolbarProps) => {
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
