import { useTranslation } from 'react-i18next'
import { Client, makeOperation, OperationContext, Provider } from 'urql'
import { interval, map, pipe } from 'wonka'

import { ImportProvider } from '@app/components/ImportSteps'
import { Import_Job_Status_Enum } from '@app/generated/graphql'

import { render, renderHook, userEvent, waitFor } from '@test/index'

import { CHUNK_RESULT_ERROR } from '../../utils'

import { Importing } from './Importing'

vi.mock('@app/components/ImportSteps/context/useImportContext', () => ({
  ...vi.importActual('@app/components/ImportSteps/context/useImportContext'),
  useImportContext: () => ({
    jobId: '123',
    currentStepKey: 'IMPORTING',
    completedSteps: ['CHOOSE', 'PREVIEW'],
    completeStep: vi.fn(),
    goToStep: vi.fn(),
    setCurrentStepKey: vi.fn(),
  }),
}))

describe(Importing.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useTranslation('pages', { keyPrefix: 'import-organisations' }),
  )
  const renderComponent = (client?: Client) => {
    const mockClient =
      client ??
      ({
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
        executeSubscription: vi.fn(),
      } as unknown as Client)
    return render(
      <Provider value={mockClient}>
        <ImportProvider>
          <Importing />
        </ImportProvider>
      </Provider>,
    )
  }
  it('should render the Importing component', () => {
    const { getByText, baseElement } = renderComponent()
    expect(baseElement).toBeTruthy()
    expect(getByText(t('steps.importing.title'))).toBeInTheDocument()
  })
  it('should render the starting import step', () => {
    const { getByText } = renderComponent()
    expect(getByText(t('steps.importing.starting'))).toBeInTheDocument()
  })

  it.each(Object.values(Import_Job_Status_Enum))(
    'renders %s status',
    async status => {
      const mockedClient = {
        executeSubscription: vi.fn(),
      }

      mockedClient.executeSubscription.mockImplementation(query => {
        return pipe(
          interval(200),
          map(() => {
            const data = {
              operation: makeOperation(
                'subscription',
                query,
                {} as OperationContext,
              ),
              data: {
                import_job_by_pk: {
                  status: status,
                  result: { total: 1 },
                },
              },
            }
            return data
          }),
        )
      })

      const { getByText } = renderComponent(mockedClient as unknown as Client)
      expect(mockedClient.executeSubscription).toHaveBeenCalled()

      const statusTranslationMap = {
        [Import_Job_Status_Enum.InProgress]: 'pending',
        [Import_Job_Status_Enum.Succeeded]: 'success',
        [Import_Job_Status_Enum.Failed]: 'failed',
        [Import_Job_Status_Enum.PartiallySucceeded]: 'partially-succeeded',
      }

      await waitFor(() => {
        expect(
          getByText(
            t(`steps.importing.description-${statusTranslationMap[status]}`),
          ),
        ).toBeInTheDocument()
      })
    },
  )
  it('shows result accordions', async () => {
    const mockedClient = {
      executeSubscription: vi.fn(),
    }

    const result = {
      total: 11,
      processed: 10,
      importedCount: 3,
      notImported: [
        { name: 'Amdaris' },
        { name: 'Team Teach' },
        { name: 'Insight ' },
      ],
      notes: [0],
    }

    mockedClient.executeSubscription.mockImplementation(query => {
      return pipe(
        interval(200),
        map(() => {
          const data = {
            operation: makeOperation(
              'subscription',
              query,
              {} as OperationContext,
            ),
            data: {
              import_job_by_pk: {
                status: Import_Job_Status_Enum.PartiallySucceeded,
                result,
              },
            },
          }
          return data
        }),
      )
    })

    const { getByText } = renderComponent(mockedClient as unknown as Client)
    expect(mockedClient.executeSubscription).toHaveBeenCalled()

    await waitFor(() => {
      expect(
        getByText(
          t('steps.importing.imported-organisations', {
            count: result.importedCount,
          }),
        ),
      ).toBeInTheDocument()

      expect(
        getByText(
          t('steps.importing.not-imported', {
            count: result.notImported.length,
          }),
        ),
      ).toBeInTheDocument()

      expect(
        getByText(
          t('steps.importing.notes', {
            count: result.notes.length,
          }),
        ),
      ).toBeInTheDocument()
    })
  })

  it.each(Object.values(CHUNK_RESULT_ERROR))(
    'invalidates organisations with %s reason',
    async reason => {
      const mockedClient = {
        executeSubscription: vi.fn(),
      }

      const result = {
        total: 1,
        processed: 1,
        importedCount: 0,
        notImported: [
          {
            name: 'Organisation 1',
            reason: reason,
          },
        ],
      }

      mockedClient.executeSubscription.mockImplementation(query => {
        return pipe(
          interval(200),
          map(() => {
            const data = {
              operation: makeOperation(
                'subscription',
                query,
                {} as OperationContext,
              ),
              data: {
                import_job_by_pk: {
                  status: Import_Job_Status_Enum.Failed,
                  result,
                },
              },
            }
            return data
          }),
        )
      })

      const { getByText, getByTestId } = renderComponent(
        mockedClient as unknown as Client,
      )
      expect(mockedClient.executeSubscription).toHaveBeenCalled()

      await waitFor(() => {
        expect(getByText(t('steps.importing.description-failed')))
        const notImportedAccordion = getByText(
          t('steps.importing.not-imported', {
            count: result.notImported.length,
          }),
        ).parentElement?.parentElement

        userEvent.click(notImportedAccordion as HTMLButtonElement)

        result.notImported.forEach(organisation => {
          expect(getByTestId(organisation.reason)).toBeInTheDocument()
        })
      })
    },
  )
})
