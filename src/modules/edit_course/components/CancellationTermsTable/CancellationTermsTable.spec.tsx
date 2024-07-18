import { useTranslation } from 'react-i18next'

import { render, renderHook, screen } from '@test/index'

import { CancellationTermsTable, TERMS } from '.'

describe(CancellationTermsTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  beforeEach(() => {
    render(<CancellationTermsTable courseStartDate={new Date()} />)
  })
  it('should render the component', () => {
    //Assert
    expect(screen.getByTestId('cancellation-terms-table')).toBeInTheDocument()
  })
  it.each([
    t('pages.edit-course.cancellation-modal.before-course-start-date'),
    t('pages.edit-course.cancellation-modal.cancellation-fee'),
  ])('should render table head cell: %s', cellName => {
    //Assert
    expect(screen.getByText(cellName)).toBeInTheDocument()
  })
  it.each(Object.entries(TERMS).filter(([_, fee]) => fee > 0))(
    'maps terms with fee greater than 0 correctly -> term: %s',
    (term, fee) => {
      //Assert
      expect(
        screen.getByText(
          t(`pages.edit-course.cancellation-modal.terms.${term}`),
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          t(
            `pages.edit-course.cancellation-modal.terms.percent-of-payment-due`,
            {
              percent: fee,
            },
          ),
        ),
      ).toBeInTheDocument()
    },
  )
  it.each(Object.entries(TERMS).filter(([_, fee]) => fee === 0))(
    'maps terms with fee equal to 0 correctly -> term: %s',
    term => {
      //Assert
      expect(
        screen.getByText(
          t(`pages.edit-course.cancellation-modal.terms.${term}`),
        ),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          t(`pages.edit-course.cancellation-modal.terms.no-fee`),
        ),
      ).toBeInTheDocument()
    },
  )
})
