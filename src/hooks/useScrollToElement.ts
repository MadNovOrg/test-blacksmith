import React, { useCallback } from 'react'

export function useScrollToElement<T extends HTMLElement>(
  ref: React.RefObject<T>
) {
  const scrollTo = useCallback(() => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current?.offsetTop,
        left: 0,
      })
    }
  }, [ref])

  return { scrollTo }
}
