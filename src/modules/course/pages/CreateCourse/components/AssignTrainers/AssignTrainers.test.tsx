import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { Course_Type_Enum } from '@app/generated/graphql'
import { RoleName, ValidCourseInput } from '@app/types'
import { courseToCourseInput } from '@app/util'

import { render, screen, within, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { AssignTrainers } from './AssignTrainers'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

const placeholder = 'Search eligible trainers...'
const selectedTestId = 'SearchTrainers-selected'

function createFetchingClient() {
  return {
    executeQuery: () => never,
  } as unknown as Client
}

describe('component: AssignTrainers', () => {
  it('renders alert if course is not found', async () => {
    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider courseType={Course_Type_Enum.Open}>
          <AssignTrainers />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await waitFor(() => {
      expect(screen.queryByTestId('AssignTrainers-alert')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-form')).toBeNull()
  })

  it('renders form if course data is in context', async () => {
    const overrides = { max_participants: 11, trainers: [] }
    const course = buildCourse({ overrides })

    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider
          initialValue={{
            courseData: courseToCourseInput(course) as ValidCourseInput,
          }}
          courseType={Course_Type_Enum.Open}
        >
          <AssignTrainers />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await waitFor(() => {
      expect(screen.queryByTestId('AssignTrainers-form')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('AssignTrainers-loading')).toBeNull()
    expect(screen.queryByTestId('AssignTrainers-alert')).toBeNull()
  })

  it('shows assistants when participants are enough', async () => {
    const overrides = { max_participants: 12, trainers: [] }
    const course = buildCourse({ overrides })

    render(
      <Provider value={createFetchingClient()}>
        <CreateCourseProvider
          initialValue={{
            courseData: courseToCourseInput(course) as ValidCourseInput,
          }}
          courseType={Course_Type_Enum.Open}
        >
          <AssignTrainers />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await waitFor(() => {
      expect(screen.queryByTestId('AssignTrainers-form')).toBeInTheDocument()
    })

    const lead = screen.getByTestId('AssignTrainers-lead')
    expect(lead).toBeInTheDocument()

    const assist = screen.getByTestId('AssignTrainers-assist')
    const assistInput = within(assist).getByPlaceholderText(placeholder)
    expect(assistInput).toBeInTheDocument()
    expect(assistInput).toHaveValue('')
    expect(assistInput).not.toBeDisabled()

    const assistHint = within(assist).getByTestId('AssignTrainers-assist-hint')
    expect(assistHint).toHaveTextContent(
      'Assist trainer(s) may be required based on the number of attendees.',
    )

    const picked = within(assist).queryAllByTestId(selectedTestId)
    expect(picked).toStrictEqual([])

    expect(screen.getByTestId('AssignTrainers-submit')).toBeDisabled()
  })
})
