import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { ImportProvider } from '@app/components/ImportSteps/context'
import { ImportOrganisationsMutation } from '@app/generated/graphql'

import { render, renderHook, userEvent, waitFor } from '@test/index'

import { Preview } from '.'

vi.mock('@app/components/ImportSteps/context/useImportContext', () => ({
  ...vi.importActual('@app/components/ImportSteps/context/useImportContext'),
  useImportContext: () => ({
    data: 'mockData',
    jobId: 'mockJobId',
    config: {
      name: 'mockName',
      country: 'mockCountry',
      state: 'mockState',
      addressLine1: 'mockAddressLine1',
      addressLine2: 'mockAddressLine2',
      city: 'mockCity',
      postcode: 'mockPostcode',
      sector: 'mockSector',
    },
    currentStepKey: 'PREVIEW',
    completedSteps: ['CHOOSE'],
    completeStep: vi.fn(),
    goToStep: vi.fn(),
    fileChosen: vi.fn(),
    importConfigured: vi.fn(),
    importStarted: vi.fn(),
    setCurrentStepKey: vi.fn(),
  }),
}))

describe(Preview.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useTranslation('pages', { keyPrefix: 'import-organisations' }),
  )
  const renderPreview = (clientMock?: Client) => {
    const client =
      clientMock ||
      ({
        executeMutation: vi.fn(),
      } as unknown as Client)

    return render(
      <ImportProvider>
        <Provider value={client}>
          <Preview />
        </Provider>
      </ImportProvider>,
    )
  }
  it('should render the preview page', () => {
    const { getByText, baseElement } = renderPreview()
    expect(baseElement).toBeInTheDocument()
    expect(getByText(t('steps.preview.title'))).toBeInTheDocument()
  })
  it('should render all preview table headers', () => {
    const { getByText } = renderPreview()
    Object.keys(
      t('steps.preview.table-cells', { returnObjects: true }),
    ).forEach(key => {
      expect(
        getByText(t(`steps.preview.table-cells.${key}`)),
      ).toBeInTheDocument()
    })
  })
  it('should start organisations import', async () => {
    const client = {
      executeMutation: vi.fn(),
      executeQuery: vi.fn(),
      executeSubscription: vi.fn(),
    }
    client.executeMutation.mockImplementation(() => {
      return fromValue<{ data: ImportOrganisationsMutation }>({
        data: {
          importOrganisations: {
            jobId: '123',
            error: null,
          },
        },
      })
    })

    const { getByText } = renderPreview(client as unknown as Client)
    const importButton = getByText(t('steps.preview.button-text'))
    userEvent.click(importButton)
    await waitFor(() => {
      expect(client.executeMutation).toHaveBeenCalledTimes(1)
    })
  })
})
