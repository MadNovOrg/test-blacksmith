import { renderHook } from '@testing-library/react'

import { Currency } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { useOrgResourcePacksPricingGetChangeEvent } from './use-org-resource-packs-pricing-change-event'

vi.mock('@app/hooks/useScopedTranslation', () => ({
  useScopedTranslation: vi.fn(),
}))

vi.mock('@app/util', () => ({
  CurrencySymbol: {
    [Currency.Aud]: '$',
    [Currency.Nzd]: 'NZ$',
  },
}))

const mockT = vi.fn()
const mockUseScopedTranslation = vi.mocked(
  await import('@app/hooks/useScopedTranslation'),
).useScopedTranslation

describe('useOrgResourcePacksPricingGetChangeEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseScopedTranslation.mockReturnValue({
      t: mockT,
    } as unknown as ReturnType<typeof useScopedTranslation>)
  })

  it('should initialize with correct translation scope', () => {
    renderHook(() => useOrgResourcePacksPricingGetChangeEvent())

    expect(mockUseScopedTranslation).toHaveBeenCalledWith(
      'pages.org-details.tabs.resource-pack-pricing.changelogs.changeEvents',
    )
  })

  describe('getChangeEvent function', () => {
    it('should handle price set scenario (empty old columns)', () => {
      mockT.mockReturnValue('Price set to $10.50 and NZ$15.75')

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {},
        new: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
      }

      const changeEvent = result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceSet', {
        audPrice: '$10.50',
        nzdPrice: 'NZ$15.75',
      })
      expect(changeEvent).toBe('Price set to $10.50 and NZ$15.75')
    })

    it('should handle both prices changed scenario', () => {
      mockT.mockReturnValue(
        'Prices changed from $5.00 and NZ$7.50 to $10.50 and NZ$15.75',
      )

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {
          AUD_price: 5.0,
          NZD_price: 7.5,
        },
        new: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
      }

      const changeEvent = result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceChangeBoth', {
        oldAudPrice: '$5.00',
        oldNzdPrice: 'NZ$7.50',
        newAudPrice: '$10.50',
        newNzdPrice: 'NZ$15.75',
      })
      expect(changeEvent).toBe(
        'Prices changed from $5.00 and NZ$7.50 to $10.50 and NZ$15.75',
      )
    })

    it('should handle no price changes scenario (both prices same)', () => {
      mockT.mockReturnValue('No price changes')

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
        new: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
      }

      const changeEvent = result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceChangeBoth', {
        oldAudPrice: '$10.50',
        oldNzdPrice: 'NZ$15.75',
        newAudPrice: '$10.50',
        newNzdPrice: 'NZ$15.75',
      })
      expect(changeEvent).toBe('No price changes')
    })

    it('should handle only AUD price changed scenario', () => {
      mockT.mockReturnValue('AUD price changed from $5.00 to $10.50')

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {
          AUD_price: 5.0,
          NZD_price: 15.75,
        },
        new: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
      }

      const changeEvent = result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceChangeAud', {
        oldPrice: '$5.00',
        newPrice: '$10.50',
      })
      expect(changeEvent).toBe('AUD price changed from $5.00 to $10.50')
    })

    it('should handle only NZD price changed scenario', () => {
      mockT.mockReturnValue('NZD price changed from NZ$7.50 to NZ$15.75')

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {
          AUD_price: 10.5,
          NZD_price: 7.5,
        },
        new: {
          AUD_price: 10.5,
          NZD_price: 15.75,
        },
      }

      const changeEvent = result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceChangeNzd', {
        oldPrice: 'NZ$7.50',
        newPrice: 'NZ$15.75',
      })
      expect(changeEvent).toBe('NZD price changed from NZ$7.50 to NZ$15.75')
    })

    it('should format prices correctly with proper decimal places', () => {
      mockT.mockReturnValue('Price set')

      const { result } = renderHook(() =>
        useOrgResourcePacksPricingGetChangeEvent(),
      )

      const event = {
        old: {},
        new: {
          AUD_price: 10,
          NZD_price: 15.1,
        },
      }

      result.current(event)

      expect(mockT).toHaveBeenCalledWith('priceSet', {
        audPrice: '$10.00',
        nzdPrice: 'NZ$15.10',
      })
    })
  })
})
