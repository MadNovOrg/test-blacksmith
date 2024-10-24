import { AwsRegions } from '@app/types'
import { blendedLearningLicensePrice } from '@app/util'

import { render } from '@test/index'

import { BlendedLearningCostAlert } from './BlendedLearningCostAlert'

describe(BlendedLearningCostAlert.name, () => {
  const matchAlertMessage = ({
    textToMatch,
    element,
  }: {
    textToMatch: string
    element: Element | null
  }): boolean => {
    const hasText = (node: HTMLElement) => node.textContent === textToMatch

    const elementHasText = hasText(element as HTMLElement)

    const childrenDoNotHaveText = Array.from(
      (element as HTMLElement).children,
    ).every(child => !hasText(child as HTMLElement))

    return elementHasText && childrenDoNotHaveText
  }

  const mockResidingCountry = 'AU'
  it.each(Object.values(AwsRegions))('should render on %s', region => {
    vi.stubEnv('VITE_AWS_REGION', region)
    const { baseElement } = render(
      <BlendedLearningCostAlert residingCountry={mockResidingCountry} />,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render ANZ AU country specific alert', () => {
    const mockAUCountry = 'AU'
    const mockInfoEmailAddress = 'info@domain.com.au'
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    vi.stubEnv('VITE_TT_INFO_EMAIL_ADDRESS_ANZ', mockInfoEmailAddress)
    const { getByText, getByRole } = render(
      <BlendedLearningCostAlert residingCountry={mockAUCountry} />,
    )

    const alertMessage = getByText(
      (_content: string, element: Element | null) =>
        matchAlertMessage({
          element,
          textToMatch: `If not already pre-purchased by the chosen organisation, each additional license will result in a A$${blendedLearningLicensePrice.AUD} (plus GST) fee per person attending this course. If you would like to bulk purchase licenses, please get in contact with ${mockInfoEmailAddress}`,
        }),
    )

    expect(alertMessage).toBeInTheDocument()
    const emailLink = getByRole('link', { name: mockInfoEmailAddress })
    expect(emailLink).toHaveAttribute('href', `mailto:${mockInfoEmailAddress}`)
  })
  it('should render ANZ NZ country specific alert', () => {
    const mockAUCountry = 'NZ'
    const mockInfoEmailAddress = 'info@domain.com.au'
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    vi.stubEnv('VITE_TT_INFO_EMAIL_ADDRESS_ANZ', mockInfoEmailAddress)
    const { getByText, getByRole } = render(
      <BlendedLearningCostAlert residingCountry={mockAUCountry} />,
    )

    const alertMessage = getByText(
      (_content: string, element: Element | null) =>
        matchAlertMessage({
          element,
          textToMatch: `If not already pre-purchased by the chosen organisation, each additional license will result in a NZ$${blendedLearningLicensePrice.NZD} (plus GST) fee per person attending this course. If you would like to bulk purchase licenses, please get in contact with ${mockInfoEmailAddress}`,
        }),
    )

    expect(alertMessage).toBeInTheDocument()
    const emailLink = getByRole('link', { name: mockInfoEmailAddress })
    expect(emailLink).toHaveAttribute('href', `mailto:${mockInfoEmailAddress}`)
  })
  it('should render UK region specific alert', () => {
    const mockAUCountry = 'GB-ENG'
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
    const { getByText } = render(
      <BlendedLearningCostAlert residingCountry={mockAUCountry} />,
    )

    const alertMessage = getByText(
      (_content: string, element: Element | null) =>
        matchAlertMessage({
          element,
          textToMatch: `If not already pre-purchased by the chosen organisation, each additional license will result in a £${blendedLearningLicensePrice.GBP} (plus VAT) fee per person attending this course.`,
        }),
    )

    expect(alertMessage).toBeInTheDocument()
  })
})
