import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { renderHook } from '@test/index'

import { useResourcePacksPricingAttributes } from './use-resource-packs-pricing-attributes'

vi.mock('@app/hooks/useScopedTranslation', () => ({
  useScopedTranslation: vi.fn(),
}))

const mockT = vi.fn()
const mockUseScopedTranslation = vi.mocked(
  await import('@app/hooks/useScopedTranslation'),
).useScopedTranslation

describe('useResourcePacksPricingAttributes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseScopedTranslation.mockReturnValue({
      t: mockT,
    } as unknown as ReturnType<typeof useScopedTranslation>)
  })

  it('should initialize with correct translation scope', () => {
    renderHook(() => useResourcePacksPricingAttributes())

    expect(mockUseScopedTranslation).toHaveBeenCalledWith(
      'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
    )
  })

  describe('getResourcePacksPricingAttributes function', () => {
    it('should return combined string for Indirect course type regardless of reaccred value', () => {
      mockT
        .mockReturnValueOnce('Non-Reaccreditation')
        .mockReturnValueOnce('Reaccreditation')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      const attributes = result.current({
        courseType: Course_Type_Enum.Indirect,
        reaccred: true,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.non-reaccreditation')
      expect(mockT).toHaveBeenCalledWith('table.alias.reaccreditation')
      expect(attributes).toBe('Non-Reaccreditation, Reaccreditation')
    })

    it('should return combined string for Indirect course type when reaccred is false', () => {
      mockT
        .mockReturnValueOnce('Non-Reaccreditation')
        .mockReturnValueOnce('Reaccreditation')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      const attributes = result.current({
        courseType: Course_Type_Enum.Indirect,
        reaccred: false,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.non-reaccreditation')
      expect(mockT).toHaveBeenCalledWith('table.alias.reaccreditation')
      expect(attributes).toBe('Non-Reaccreditation, Reaccreditation')
    })

    it('should return reaccreditation translation for non-Indirect course type when reaccred is true', () => {
      mockT.mockReturnValue('Reaccreditation Course')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      const attributes = result.current({
        courseType: Course_Type_Enum.Closed,
        reaccred: true,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.reaccreditation')
      expect(attributes).toBe('Reaccreditation Course')
    })

    it('should return non-reaccreditation translation for non-Indirect course type when reaccred is false', () => {
      mockT.mockReturnValue('Non-Reaccreditation Course')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      const attributes = result.current({
        courseType: Course_Type_Enum.Closed,
        reaccred: false,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.non-reaccreditation')
      expect(attributes).toBe('Non-Reaccreditation Course')
    })

    // Test with different course types (assuming they exist in your enum)
    it('should handle different course types correctly', () => {
      mockT.mockReturnValue('Test Translation')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      // Test with hypothetical course types - adjust based on your actual enum values
      const courseTypes = Object.values(Course_Type_Enum).filter(
        type => type !== Course_Type_Enum.Indirect,
      )

      courseTypes.forEach(courseType => {
        result.current({
          courseType,
          reaccred: true,
        })

        expect(mockT).toHaveBeenCalledWith('table.alias.reaccreditation')
      })
    })

    it('should return the same function reference on re-renders when t is stable', () => {
      const { result, rerender } = renderHook(() =>
        useResourcePacksPricingAttributes(),
      )

      const firstRender = result.current
      rerender()
      const secondRender = result.current

      expect(firstRender).toBe(secondRender)
    })

    it('should handle edge case with empty translation strings', () => {
      mockT.mockReturnValue('')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      const attributes = result.current({
        courseType: Course_Type_Enum.Indirect,
        reaccred: true,
      })

      expect(attributes).toBe(', ')
    })

    it('should maintain proper translation key format', () => {
      mockT.mockReturnValue('Test')

      const { result } = renderHook(() => useResourcePacksPricingAttributes())

      result.current({
        courseType: Course_Type_Enum.Closed,
        reaccred: true,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.reaccreditation')

      mockT.mockClear()

      result.current({
        courseType: Course_Type_Enum.Closed,
        reaccred: false,
      })

      expect(mockT).toHaveBeenCalledWith('table.alias.non-reaccreditation')
    })
  })
})
