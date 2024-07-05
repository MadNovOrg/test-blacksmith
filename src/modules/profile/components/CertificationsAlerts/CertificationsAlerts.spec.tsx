import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { render, screen } from '@test/index'
import { buildCertificate } from '@test/mock-data-utils'

import { CertificationsAlerts } from '.'

describe(CertificationsAlerts.name, () => {
  const certificateMock = buildCertificate()
  const setup = (certificate = certificateMock, index = 0) =>
    render(
      <CertificationsAlerts
        index={index}
        certificate={
          certificate as GetProfileDetailsQuery['certificates'][0] // buildCertificate uses types from @app/types 🙃
        }
      />,
    )
  it('should render the component', () => {
    setup()
    expect(screen.getByText(certificateMock.courseName)).toBeInTheDocument()
  })
  it.each([certificateMock.courseName, certificateMock.number])(
    'should render certificate details correctly: %s',
    detail => {
      setup()
      expect(screen.getByText(detail)).toBeInTheDocument()
    },
  )
  it('should render exired certificate correctly', () => {
    // Arrange
    const certificate = buildCertificate({
      overrides: {
        expiryDate: '01-01-2000',
      },
    })
    // Act
    setup(certificate)

    // Assert
    expect(screen.getByTestId('expired-certificate-alert')).toBeInTheDocument()
  })
  it('should render valid certificate correctly', () => {
    // Arrange
    const certificate = buildCertificate({
      overrides: {
        expiryDate: '01-01-2026',
      },
    })
    // Act
    setup(certificate)

    // Assert
    expect(screen.getByTestId('valid-certificate-alert')).toBeInTheDocument()
  })
})
