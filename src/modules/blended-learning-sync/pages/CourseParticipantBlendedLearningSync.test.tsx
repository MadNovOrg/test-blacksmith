vi.mock(
  '@app/modules/course_details/hooks/course-participant/useCourseParticipantGO1EnrollmentsByPK',
  () => ({
    default: vi.fn(),
    useCourseParticipantByPK: vi.fn(),
  }),
)

vi.mock(
  '@app/modules/course_details/hooks/course-participant/update-course-participant-go1-data',
  () => ({
    useUpdateCourseParticipantGO1Data: vi.fn(),
  }),
)

import { Route, Routes } from 'react-router-dom'

import {
  Blended_Learning_Status_Enum,
  Go1EnrollmentStatus,
} from '@app/generated/graphql'
import { useUpdateCourseParticipantGO1Data } from '@app/modules/course_details/hooks/course-participant/update-course-participant-go1-data'
import useCourseParticipantByPK from '@app/modules/course_details/hooks/course-participant/useCourseParticipantGO1EnrollmentsByPK'

import { chance, fireEvent, _render, screen, waitFor } from '@test/index'

import { CourseParticipantBlendedLearningSync } from './CourseParticipantBlendedLearningSync'

const mockUseCourseParticipantByPK = vi.mocked(useCourseParticipantByPK)
const mockUseUpdateCourseParticipantGO1Data = vi.mocked(
  useUpdateCourseParticipantGO1Data,
)

describe('CourseParticipantBlendedLearningSync', () => {
  const mockUpdate: ReturnType<typeof useUpdateCourseParticipantGO1Data>[1] =
    vi.fn()

  const mockCourseParticipantByPK: ReturnType<typeof useCourseParticipantByPK> =
    {
      courseParticipant: {
        id: '123',
        go1EnrolmentId: 2,
        profile: {
          id: chance.guid(),
          fullName: 'John Doe',
        },
      },
      blendedLearningEnrollments: [
        {
          id: 1,
          status: Go1EnrollmentStatus.Inprogress,
          learningObject: {
            id: chance.natural(),
            title: 'Blended Learning 2025',
          },
        },
        {
          id: 2,
          status: Go1EnrollmentStatus.Completed,
          learningObject: {
            id: chance.natural(),
            title: 'Blended Learning 2024',
          },
        },
      ],
      error: null,
      loading: false,
    }

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseCourseParticipantByPK.mockReturnValue(mockCourseParticipantByPK)

    mockUseUpdateCourseParticipantGO1Data.mockReturnValue([
      { data: undefined, fetching: false, stale: false },
      mockUpdate,
    ])
  })

  function renderComponent() {
    return _render(
      <Routes>
        <Route
          path="/participant/:participantId/sync"
          element={<CourseParticipantBlendedLearningSync />}
        />
      </Routes>,
      {},
      { initialEntries: ['/participant/123/sync'] },
    )
  }

  it('renders loading spinner when loading is true', () => {
    mockUseCourseParticipantByPK.mockReturnValue({
      blendedLearningEnrollments: [],
      courseParticipant: null,
      error: null,
      loading: true,
    })

    renderComponent()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders participant name and course enrollments', () => {
    renderComponent()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Blended Learning 2025')).toBeInTheDocument()
    expect(
      screen.getByText('Blended Learning 2024 (Current)'),
    ).toBeInTheDocument()
  })

  it('disables sync button initially', () => {
    renderComponent()
    const syncButton = screen.getByTestId('sync-btn')
    expect(syncButton).toBeDisabled()
  })

  it('enables sync button when a different enrollment is selected', async () => {
    renderComponent()

    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    await waitFor(() => {
      const syncButton = screen.getByTestId('sync-btn')
      expect(syncButton).toBeEnabled()
    })
  })

  it('calls update function when sync button is clicked', async () => {
    renderComponent()

    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    const syncButton = screen.getByTestId('sync-btn')
    fireEvent.click(syncButton)

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        courseParticipantId: '123',
        go1EnrolmentId: 1,
        go1EnrolmentStatus: Blended_Learning_Status_Enum.InProgress,
      })
    })
  })
})
