import { renderHook } from '@testing-library/react'

import { useAuth } from '@app/context/auth'

import {
  anzAvailableCurrencies,
  ukAvailableCurrencies,
  useCurrencies,
} from './useCurrencies'

vi.mock('@app/context/auth', async () => ({
  ...((await vi.importActual('@app/context/auth')) as object),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      isAustralia: vi.fn().mockReturnValue(false),
      isUK: vi.fn().mockReturnValue(true),
    },
  }),
}))

const useAuthMock = vi.mocked(useAuth)

describe(useCurrencies.name, () => {
  it('should return a default currency for UK', () => {
    const result = renderHook(() => useCurrencies()).result
    expect(result.current.defaultCurrency).toBeDefined()
    expect(result.current.defaultCurrency).toBe('GBP')
  })
  it('should return a default currency for UK with residing country other than UK', () => {
    const result = renderHook(() => useCurrencies('FJ')).result
    expect(result.current.defaultCurrency).toBeDefined()
    expect(result.current.defaultCurrency).toBe('GBP')
  })
  it('should return a default currency for ANZ', () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(true),
        isUK: vi.fn().mockReturnValue(false),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const result = renderHook(() => useCurrencies()).result
    expect(result.current.defaultCurrency).toBeDefined()
    expect(result.current.defaultCurrency).toBe('AUD')
  })
  it('should return a default currency for ANZ with NZ residing country', () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(true),
        isUK: vi.fn().mockReturnValue(false),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const result = renderHook(() => useCurrencies('NZ')).result
    expect(result.current.defaultCurrency).toBeDefined()
    expect(result.current.defaultCurrency).toBe('NZD')
  })
  it("should return a default currency for ANZ with a residing country that isn't NZ", () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(true),
        isUK: vi.fn().mockReturnValue(false),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const result = renderHook(() => useCurrencies('FJ')).result
    expect(result.current.defaultCurrency).toBeDefined()
    expect(result.current.defaultCurrency).toBe('AUD')
  })
  it('should return active currencies for UK', () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(false),
        isUK: vi.fn().mockReturnValue(true),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const result = renderHook(() => useCurrencies()).result
    expect(result.current.activeCurrencies).toBeDefined()
    expect(result.current.activeCurrencies).toEqual(ukAvailableCurrencies)
  })
  it('should return active currencies for ANZ', () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(true),
        isUK: vi.fn().mockReturnValue(false),
      },
    } as unknown as ReturnType<typeof useAuth>)
    const result = renderHook(() => useCurrencies()).result
    expect(result.current.activeCurrencies).toBeDefined()
    expect(result.current.activeCurrencies).toEqual(anzAvailableCurrencies)
  })
})
