import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const useScopedTranslation = (
  scope: string
): { _t: TFunction; t: TFunction } => {
  const [ns, ...prefix] = scope.split('.')
  const { t: _t } = useTranslation()
  const { t } = useTranslation(ns, { keyPrefix: prefix.join('.') })

  return useMemo(() => ({ t, _t }), [t, _t])
}
