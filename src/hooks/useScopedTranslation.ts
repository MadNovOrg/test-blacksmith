import { TFunction } from 'i18next'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const useScopedTranslation = (
  scope: string
): { _t: TFunction; t: TFunction } => {
  const { t: _t } = useTranslation()

  const t = useCallback(
    (label: string, ...rest) => {
      return _t(`${scope}.${label}`, ...rest)
    },
    [_t, scope]
  )

  return useMemo(() => ({ t, _t }), [t, _t])
}
