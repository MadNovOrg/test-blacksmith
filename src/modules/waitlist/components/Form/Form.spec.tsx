import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { Recaptcha } from '@app/components/Recaptcha'
import { createRecaptchaComp } from '@app/components/Recaptcha/test-utils'
import { GetCourseResidingCountryQuery } from '@app/generated/graphql'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { Form, FormInputs } from './Form'

const RecaptchaMock = createRecaptchaComp()

vi.mock('@app/components/Recaptcha', async () => ({
  __esModule: true,
  ...((await vi.importActual('@app/components/Recaptcha')) as object),
  Recaptcha: vi.fn(),
}))

const MockedRecaptcha = vi.mocked(Recaptcha)

describe(`Waitlist: ${Form.name}`, () => {
  const client = {
    executeQuery: () =>
      fromValue<{ data: GetCourseResidingCountryQuery }>({
        data: {
          course: [
            {
              residingCountry: 'GB',
            },
          ],
        },
      }),
  } as unknown as Client

  beforeEach(() => {
    MockedRecaptcha.mockImplementation(RecaptchaMock)
  })

  it('validates form', async () => {
    render(
      <Provider value={client}>
        <Form onSuccess={vi.fn} saving={false} courseId={chance.integer()} />
      </Provider>
    )

    await userEvent.click(screen.getByText(/join waiting list/i))

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/surname is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter your email/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/organisation name is required/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/recaptcha is required/i)).toBeInTheDocument()
    })

    await userEvent.type(screen.getByLabelText(/work email/i), 'invalid-email')

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it('calls callback when form is submitted', async () => {
    const submittedData: Omit<FormInputs, 'phone'> = {
      firstName: chance.first(),
      surname: chance.last(),
      email: chance.email(),
      orgName: chance.name(),
      recaptchaToken: 'token',
    }
    const onSuccessMock = vi.fn(() => never)

    render(
      <Provider value={client}>
        <Form
          onSuccess={onSuccessMock}
          saving={false}
          courseId={chance.integer()}
        />
      </Provider>
    )

    await userEvent.type(
      screen.getByLabelText(/first name/i),
      submittedData.firstName
    )
    await userEvent.type(
      screen.getByLabelText(/last name/i),
      submittedData.surname
    )
    await userEvent.type(
      screen.getByLabelText(/email/i),
      submittedData.email ?? ''
    )
    await userEvent.type(screen.getByLabelText(/phone/i), '7999999999')
    await userEvent.type(
      screen.getByLabelText(/organisation name/i),
      submittedData.orgName
    )
    await userEvent.click(screen.getByText(/join waiting list/i))
    await userEvent.click(screen.getByTestId('recaptcha-success'))

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1)
      expect(onSuccessMock).toHaveBeenCalledWith({
        ...submittedData,
        phone: '+44 7999 999999',
      })
    })
  })

  it('invalidates form when recaptcha expires', async () => {
    const submittedData: FormInputs = {
      firstName: chance.first(),
      surname: chance.last(),
      email: chance.email(),
      orgName: chance.name(),
      phone: '7999999999',
      recaptchaToken: 'token',
    }

    render(
      <Provider value={client}>
        <Form onSuccess={vi.fn()} saving={false} courseId={chance.integer()} />
      </Provider>
    )

    await userEvent.type(
      screen.getByLabelText(/first name/i),
      submittedData.firstName
    )
    await userEvent.type(
      screen.getByLabelText(/last name/i),
      submittedData.surname
    )
    await userEvent.type(
      screen.getByLabelText(/email/i),
      submittedData.email ?? ''
    )
    await userEvent.type(screen.getByLabelText(/phone/i), submittedData.phone)
    await userEvent.type(
      screen.getByLabelText(/organisation name/i),
      submittedData.orgName
    )

    await userEvent.click(screen.getByText(/join waiting list/i))
    await userEvent.click(screen.getByTestId('recaptcha-success'))

    await userEvent.click(screen.getByTestId('recaptcha-expired'))

    await userEvent.click(screen.getByText(/join waiting list/i))

    await waitFor(() => {
      expect(screen.getByText(/recaptcha is required/i)).toBeInTheDocument()
    })
  })
})
