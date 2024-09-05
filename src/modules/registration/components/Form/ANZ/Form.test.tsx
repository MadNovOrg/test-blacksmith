import { CognitoUser } from 'amazon-cognito-identity-js'
import { Auth } from 'aws-amplify'
import { vi, MockedFunction } from 'vitest'

import { Recaptcha } from '@app/components/Recaptcha'
import { createRecaptchaComp } from '@app/components/Recaptcha/test-utils'
import { gqlRequest } from '@app/lib/gql-request'
import { useJobTitles } from '@app/modules/profile/hooks/useJobTitles'

import { render, screen, userEvent, waitFor } from '@test/index'

import { Form } from './Form'

vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/lib/gql-request')
vi.mock('aws-amplify')
vi.mock('@app/modules/profile/hooks/useJobTitles')
vi.mock('@app/components/OrgSelector/ANZ', () => ({
  OrgSelector: vi.fn(({ onChange }) => {
    return (
      <input
        name="org-selector"
        data-testid="org-selector"
        onChange={() => onChange({ id: 'org-id' })}
      />
    )
  }),
}))

const gqlRequestMocked = vi.mocked(gqlRequest)
const mockSignup = vi.mocked(Auth.signUp)

const mockUseJobTitles = useJobTitles as MockedFunction<typeof useJobTitles>

const defaultProps = {
  onSignUp: vi.fn(),
  courseId: 123,
  quantity: 2,
}

const RecaptchaMock = createRecaptchaComp()

mockUseJobTitles.mockReturnValue([
  'Administrator',
  'Assistant Director of Nursing',
  'Assistant Headteacher',
  'Other',
])

vi.mock('@app/components/Recaptcha', async () => ({
  __esModule: true,
  ...((await vi.importActual('@app/components/Recaptcha')) as object),
  Recaptcha: vi.fn(),
}))

const MockedRecaptcha = vi.mocked(Recaptcha)

describe('Form', () => {
  beforeEach(() => {
    MockedRecaptcha.mockImplementation(RecaptchaMock)
  })

  it('displays error message if first name not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    await userEvent.click(screen.getByLabelText('T&Cs'))

    await userEvent.click(screen.getByTestId('signup-form-btn'))

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/)).toBeInTheDocument()
    })
  })

  it('displays error message if surname not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    await userEvent.click(screen.getByLabelText('T&Cs'))

    await userEvent.click(screen.getByTestId('signup-form-btn'))
    await waitFor(() => {
      expect(screen.getByText(/Surname is required/)).toBeInTheDocument()
    })
  })

  it('displays error message if password not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    await userEvent.click(screen.getByLabelText('T&Cs'))
    await userEvent.click(screen.getByTestId('signup-form-btn'))

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 8 characters/),
      ).toBeInTheDocument()
    })
  })

  it('should correctly display the Password Hint Message', () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const passwordHintMessage = screen.getByTestId('password-hint-message')
    expect(passwordHintMessage).toBeInTheDocument()
  })

  it('displays error message if phone number not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.click(screen.getByLabelText('T&Cs'))

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    await waitFor(() => {
      expect(screen.getByText(/Phone is required/)).toBeInTheDocument()
    })
  })

  it('displays error message if date of birth is not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')

    await userEvent.click(screen.getByLabelText('T&Cs'))

    await userEvent.click(screen.getByTestId('signup-form-btn'))

    await waitFor(() => {
      expect(
        screen.getByText(/please enter your date of birth/i),
      ).toBeInTheDocument()
    })
  })

  it('displays error message if job title is not provided', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')
    await userEvent.click(screen.getByLabelText('T&Cs'))

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    await waitFor(() => {
      expect(screen.getByText(/Job Title is required/)).toBeInTheDocument()
    })
  })

  it('displays error message if T&Cs not accepted', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0000000000')

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    await waitFor(() => {
      expect(
        screen.getByText(/Accepting our T&C is required/),
      ).toBeInTheDocument()
    })
  })

  it('displays error message if recaptcha is not verified', async () => {
    render(<Form {...defaultProps} />)

    await userEvent.click(
      screen.getByRole('button', { name: /create account/i }),
    )

    expect(screen.getByText(/recaptcha is required/i)).toBeInTheDocument()
  })

  it('displays error message if unknown error occurs on signup', async () => {
    gqlRequestMocked.mockImplementation(() => {
      throw new Error()
    })

    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0491111111')
    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

    await userEvent.click(screen.getByTestId('recaptcha-success'))

    // Selects your default value of the date field
    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    await userEvent.click(screen.getByLabelText('T&Cs'))

    await userEvent.click(screen.getByLabelText('Job Title *'))
    await userEvent.click(screen.getByTestId('job-position-Other'))
    await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    const errorMessageField = screen.getByTestId('signup-form-error')
    await waitFor(() => {
      expect(errorMessageField).toBeInTheDocument()
      expect(errorMessageField).toHaveTextContent(
        'An error occurred. Please try again.',
      )
    })
  })

  it('displays error message if email already exists', async () => {
    gqlRequestMocked.mockResolvedValue({})
    mockSignup.mockImplementation(() => {
      const error = new Error() as Error & { code: string }
      error.code = 'UsernameExistsException'
      throw error
    })

    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(screen.getByTestId('input-email'), 'test@email.com')
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0491111111')
    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

    await userEvent.click(screen.getByLabelText('Job Title *'))
    await userEvent.click(screen.getByTestId('job-position-Other'))
    await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

    // Selects your default value of the date field
    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    await userEvent.click(screen.getByLabelText('T&Cs'))
    await userEvent.click(screen.getByTestId('recaptcha-success'))

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    await waitFor(() => {
      const errorMessageField = screen.getByTestId('signup-form-error')
      expect(errorMessageField).toBeInTheDocument()
      expect(errorMessageField).toHaveTextContent(
        'An account with the given email already exists.',
      )
    })
  })

  it('displays error message if birth date is under minimal age', async () => {
    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/2022')

    await userEvent.click(screen.getByTestId('signup-form-btn'))

    await waitFor(() => {
      const datePicker = screen.getByLabelText(/date of birth/i)
      expect(datePicker).toBeInvalid()
    })
  })

  it('submits the form with a lowercase and trimmed email', async () => {
    gqlRequestMocked.mockResolvedValue({})
    mockSignup.mockResolvedValue({
      user: {} as unknown as CognitoUser,
      userSub: '123',
      userConfirmed: false,
      codeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '...',
      },
    })

    const props = { ...defaultProps }
    render(<Form {...props} />)

    const form = screen.getByTestId('signup-form')
    expect(form).toBeInTheDocument()

    await userEvent.type(screen.getByTestId('input-first-name'), 'testName')
    await userEvent.type(screen.getByTestId('input-surname'), 'testSurname')
    await userEvent.type(
      screen.getByTestId('input-email'),
      'joHn.DOE@exAmple.com ',
    )
    await userEvent.type(screen.getByTestId('input-password'), 'Test1234!')
    await userEvent.type(screen.getByTestId('input-phone'), '0491111111')
    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

    await userEvent.click(screen.getByTestId('recaptcha-success'))

    // Selects your default value of the date field
    await userEvent.type(screen.getByLabelText(/date of birth/i), '20/03/1990')

    await userEvent.click(screen.getByLabelText('T&Cs'))

    await userEvent.click(screen.getByLabelText('Job Title *'))
    await userEvent.click(screen.getByTestId('job-position-Other'))
    await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('signup-form-btn'))
    })

    await waitFor(async () => {
      expect(gqlRequestMocked).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: expect.objectContaining({
            email: 'john.doe@example.com',
          }),
        }),
      )
    })
  })
})
