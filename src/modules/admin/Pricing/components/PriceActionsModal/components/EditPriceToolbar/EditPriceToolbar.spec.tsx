import { DataGrid } from '@mui/x-data-grid'

import { fireEvent, _render, screen } from '@test/index'

import { EditPriceToolbar } from './EditPriceToolbar'
describe(EditPriceToolbar.name, () => {
  const setRowsMock = vi.fn()
  const setRowsModelMock = vi.fn()
  it('should _render the component', () => {
    _render(
      <DataGrid
        rows={[]}
        columns={[]}
        slots={{ toolbar: EditPriceToolbar }}
        slotProps={{
          toolbar: { setRows: setRowsMock, setRowModesModel: setRowsModelMock },
        }}
      />,
    )
    expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
  })
  it('should add an additional pricing row', () => {
    _render(
      <DataGrid
        rows={[]}
        columns={[]}
        slots={{ toolbar: EditPriceToolbar }}
        slotProps={{
          toolbar: { setRows: setRowsMock, setRowModesModel: setRowsModelMock },
        }}
      />,
    )
    fireEvent.click(screen.getByTestId('AddIcon'))
    expect(setRowsMock).toHaveBeenCalledTimes(1)
    expect(setRowsModelMock).toHaveBeenCalledTimes(1)
  })
})
