import { CognitoUser } from 'amazon-cognito-identity-js'
import { Auth } from 'aws-amplify'
import { vi, MockedFunction } from 'vitest'

import { useJobTitles } from '@app/components/JobTitleSelector/useJobTitles'
import { Recaptcha } from '@app/components/Recaptcha'
import { createRecaptchaComp } from '@app/components/Recaptcha/test-utils'
import {
  Cud_Operation_Enum,
  Org_Created_From_Enum,
} from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'
import { AwsRegions } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import { profile } from '@test/providers'

import { Form } from './Form'

vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/lib/gql-request')
vi.mock('aws-amplify')
vi.mock('@app/components/JobTitleSelector/useJobTitles')
vi.mock('@app/components/OrgSelector/UK', () => ({
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
const basicOrg = {
  id: 'org-id',
  name: 'org-name',
}
const useInsertNewOrganisationMock = vi.fn().mockResolvedValue({
  data: { org: basicOrg },
})
vi.mock('@app/hooks/useInsertNewOrganisationLead', async () => {
  const actual = await vi.importActual(
    '@app/hooks/useInsertNewOrganisationLead',
  )
  return {
    ...actual,
    useInsertNewOrganization: () => [
      {
        fetching: false,
        error: undefined,
        data: { org: basicOrg },
      },
      useInsertNewOrganisationMock,
    ],
  }
})

const useInsertOrgLogMock = vi.fn()
vi.mock('@app/modules/organisation/queries/insert-org-log', async () => {
  const actual = await vi.importActual(
    '@app/modules/organisation/queries/insert-org-log',
  )
  return {
    ...actual,
    useInsertOrganisationLog: () => [
      {
        fetching: false,
        error: undefined,
        data: { org_log: { id: chance.guid() } },
      },
      useInsertOrgLogMock,
    ],
  }
})

vi.mock('@app/components/OrgSelector/UK/utils', async () => {
  const actual = await vi.importActual('@app/components/OrgSelector/UK/utils')
  return {
    ...actual,
    useOrganizationToBeCreatedOnRegistration: () => {
      return {
        name: basicOrg.name,
        sector: 'edu',
        orgType: 'UTC',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'W1 1AA',
          country: 'England',
          countryCode: 'GB-ENG',
        },
      }
    },
  }
})

vi.mock('@app/components/OrgSelector/ANZ/utils', async () => {
  const actual = await vi.importActual('@app/components/OrgSelector/ANZ/utils')
  return {
    ...actual,
    useOrganizationToBeCreatedOnRegistration: () => {
      return {
        name: basicOrg.name,
        sector: 'anz_edu',
        orgType: 'UTC',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'W1 1AA',
          country: 'Australia',
          countryCode: 'AU',
          region: 'Australian Capital Territory',
        },
      }
    },
  }
})

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
  ...(await vi.importActual('@app/components/Recaptcha')),
  Recaptcha: vi.fn(),
}))

const MockedRecaptcha = vi.mocked(Recaptcha)

describe('Form', () => {
  beforeEach(() => {
    MockedRecaptcha.mockImplementation(RecaptchaMock)
  })

  it.each(Object.values(AwsRegions))(
    'displays error message if first name not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if surname not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if password not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'should correctly display the Password Hint Message %s',
    region => {
      vi.stubEnv('VITE_AWS_REGION', region)
      const props = { ...defaultProps }
      render(<Form {...props} />)

      const passwordHintMessage = screen.getByTestId('password-hint-message')
      expect(passwordHintMessage).toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if phone number not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if date of birth is not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if job title is not provided %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if T&Cs not accepted %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if recaptcha is not verified %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
      render(<Form {...defaultProps} />)

      await userEvent.click(
        screen.getByRole('button', { name: /create account/i }),
      )

      expect(screen.getByText(/recaptcha is required/i)).toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if unknown error occurs on signup %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
      await userEvent.type(
        screen.getByTestId('input-phone'),
        region === AwsRegions.UK ? '1234567890' : '0491111111',
      )
      await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

      await userEvent.click(screen.getByTestId('recaptcha-success'))

      // Selects your default value of the date field
      await userEvent.type(
        screen.getByLabelText(/date of birth/i),
        '20/03/1990',
      )

      await userEvent.click(screen.getByLabelText('T&Cs'))

      await userEvent.click(screen.getByLabelText('Job Title *'))
      await userEvent.click(screen.getByTestId('job-position-Other'))
      await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

      await waitFor(async () => {
        await userEvent.click(screen.getByTestId('signup-form-btn'))
      })

      await waitFor(() => {
        const errorMessageField = screen.getByTestId('signup-form-error')
        expect(errorMessageField).toBeInTheDocument()
        expect(errorMessageField).toHaveTextContent(
          'An error occurred. Please try again.',
        )
      })
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if email already exists %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
      await userEvent.type(
        screen.getByTestId('input-phone'),
        region === AwsRegions.UK ? '1234567890' : '0491111111',
      )
      await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

      await userEvent.click(screen.getByLabelText('Job Title *'))
      await userEvent.click(screen.getByTestId('job-position-Other'))
      await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

      // Selects your default value of the date field
      await userEvent.type(
        screen.getByLabelText(/date of birth/i),
        '20/03/1990',
      )

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
    },
  )

  it.each(Object.values(AwsRegions))(
    'displays error message if birth date is under minimal age %s',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
      const props = { ...defaultProps }
      render(<Form {...props} />)

      const form = screen.getByTestId('signup-form')
      expect(form).toBeInTheDocument()

      await userEvent.type(
        screen.getByLabelText(/date of birth/i),
        '20/03/2022',
      )

      await userEvent.click(screen.getByTestId('signup-form-btn'))

      await waitFor(() => {
        const datePicker = screen.getByLabelText(/date of birth/i)
        expect(datePicker).toBeInvalid()
      })
    },
  )

  it.each(Object.values(AwsRegions))(
    'submits the form with a lowercase and trimmed email',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
      await userEvent.type(
        screen.getByTestId('input-phone'),
        region === AwsRegions.UK ? '1234567890' : '0491111111',
      )
      await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

      await userEvent.click(screen.getByTestId('recaptcha-success'))

      // Selects your default value of the date field
      await userEvent.type(
        screen.getByLabelText(/date of birth/i),
        '20/03/1990',
      )

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
    },
  )

  it.each(Object.values(AwsRegions))(
    'inserts organization and organization log on account creation',
    async region => {
      vi.stubEnv('VITE_AWS_REGION', region)
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
      await userEvent.type(
        screen.getByTestId('input-phone'),
        region === AwsRegions.UK ? '1234567890' : '0491111111',
      )
      await userEvent.type(screen.getByTestId('org-selector'), 'Organization')

      await userEvent.click(screen.getByTestId('recaptcha-success'))

      // Selects your default value of the date field
      await userEvent.type(
        screen.getByLabelText(/date of birth/i),
        '20/03/1990',
      )

      await userEvent.click(screen.getByLabelText('T&Cs'))

      await userEvent.click(screen.getByLabelText('Job Title *'))
      await userEvent.click(screen.getByTestId('job-position-Other'))
      await userEvent.type(screen.getByTestId('other-job-title-input'), 'Admin')

      await waitFor(async () => {
        await userEvent.click(screen.getByTestId('signup-form-btn'))
      })

      await waitFor(() => {
        expect(useInsertNewOrganisationMock).toHaveBeenCalledTimes(1)
        expect(useInsertNewOrganisationMock).toHaveBeenCalledWith({
          name: basicOrg.name,
          sector: region === AwsRegions.UK ? 'edu' : 'anz_edu',
          orgType: 'UTC',
          address: {
            line1: 'line1',
            line2: 'line2',
            city: 'city',
            postcode: 'W1 1AA',
            country: region === AwsRegions.UK ? 'England' : 'Australia',
            countryCode: region === AwsRegions.UK ? 'GB-ENG' : 'AU',
            ...(region === AwsRegions.Australia && {
              region: 'Australian Capital Territory',
            }),
          },
        })
      })

      expect(useInsertOrgLogMock).toHaveBeenCalledTimes(1)
      expect(useInsertOrgLogMock).toHaveBeenCalledWith({
        orgId: basicOrg.id,
        createfrom: Org_Created_From_Enum.RegisterPage,
        op: Cud_Operation_Enum.Create,
        userId: profile?.id,
        updated_columns: {
          old: null,
          new: basicOrg,
        },
      })
    },
  )
})
