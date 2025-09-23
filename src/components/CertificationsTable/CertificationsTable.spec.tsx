import { useTranslation } from 'react-i18next'

import { GetProfileDetailsQuery } from '@app/generated/graphql'
import { capitalize } from '@app/util'

import { _render, renderHook, screen, userEvent } from '@test/index'
import { buildCertificate } from '@test/mock-data-utils'

import { CertificationsTable } from './CertificationsTable'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(CertificationsTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const certifications = [
    buildCertificate(),
  ] as GetProfileDetailsQuery['certificates']
  beforeEach(() =>
    _render(
      <CertificationsTable certifications={certifications} verified={true} />,
    ),
  )
  it('should _render the component', () => {
    expect(screen.getByText(t('certifications'))).toBeInTheDocument()
  })
  it.each([t('course-name'), t('certificate'), t('status'), t('certificate')])(
    'should _render table head cells: %s',
    cell => {
      screen
        .getAllByText(cell)
        .forEach(cellText => expect(cellText).toBeInTheDocument())
    },
  )
  describe.each(certifications)(
    'should _render all certificate details',
    certificate => {
      it.each([
        certificate.courseName,
        certificate.number,
        capitalize(certificate.status as string),
      ])('should _render: %s', value => {
        expect(screen.getByText(value)).toBeInTheDocument()
      })
      it('should navigate to certificate details', async () => {
        const viewCertificateButton = screen.getByRole('button')
        await userEvent.click(viewCertificateButton)
        expect(mockNavigate).toHaveBeenCalledTimes(certifications.length)
        expect(mockNavigate).toHaveBeenCalledWith(
          `/certification/${certificate.id}`,
        )
      })
    },
  )
})
