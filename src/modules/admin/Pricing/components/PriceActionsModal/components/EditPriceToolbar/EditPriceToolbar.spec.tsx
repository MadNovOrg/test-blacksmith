import { DataGrid } from '@mui/x-data-grid'

import { fireEvent, render, screen } from '@test/index'

import { EditPriceToolbar } from './EditPriceToolbar'
describe(EditPriceToolbar.name, () => {
  const setRowsMock = vi.fn()
  const setRowsModelMock = vi.fn()
  it('should render the component', () => {
    render(
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
    render(
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
