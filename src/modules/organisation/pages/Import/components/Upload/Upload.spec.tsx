import { useTranslation } from 'react-i18next'

import { ImportProvider } from '@app/components/ImportSteps/context'

import { fireEvent, render, renderHook } from '@test/index'

import { Upload } from './Upload'

describe(Upload.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useTranslation('pages', { keyPrefix: 'import-organisations' }),
  )

  const renderComponent = () => {
    return render(
      <ImportProvider>
        <Upload />
      </ImportProvider>,
    )
  }
  it('should render successfully', () => {
    const { getByText, baseElement } = renderComponent()
    expect(baseElement).toBeTruthy()
    expect(getByText(t('steps.upload.title'))).toBeInTheDocument()
  })
  it('should render the upload component', () => {
    const { getByText } = renderComponent()
    expect(getByText(t('steps.upload.title'))).toBeInTheDocument()
  })
  it('should call handleUploadChange when file is uploaded', () => {
    const { getByTestId } = renderComponent()
    const input = getByTestId('upload-orgs-file')
    fireEvent.change(input, {
      target: {
        files: [new File([''], 'file.csv', { type: 'text/csv' })],
      },
    })
    expect((input as HTMLInputElement).files).toHaveLength(1)
  })
})
