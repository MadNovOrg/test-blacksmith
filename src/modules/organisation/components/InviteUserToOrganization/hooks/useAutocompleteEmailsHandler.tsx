import { useCallback } from 'react'

interface UseEmailHandlerOptions {
  fieldName?: string
  delimiters?: RegExp
  normalize?: (email: string) => string
  validate?: (email: string) => boolean
  shouldValidateOnAdd?: boolean
}

export const useAutocompleteEmailsHandler = (
  setValue: (
    name: string,
    value: string[],
    options?: { shouldValidate?: boolean },
  ) => void,
  currentEmails: string[],
  isSubmitted: boolean,
  options: UseEmailHandlerOptions = {},
) => {
  const {
    fieldName = 'emails',
    delimiters = /[,\s;]/,
    normalize = (email: string) => email.toLowerCase().trim(),
    validate = () => true,
    shouldValidateOnAdd = false,
  } = options

  const handleEmailsChange = useCallback(
    (
      ev: React.SyntheticEvent<Element, Event>,
      value: (string | string[])[],
      reason: string,
    ) => {
      if (reason === 'removeOption') {
        return setValue(fieldName, value as string[], {
          shouldValidate: isSubmitted,
        })
      }

      const [last] = value.slice(-1) as string[]
      const newEntries = last
        .split(delimiters)
        .map(normalize)
        .filter(Boolean)
        .filter(validate)

      setValue(fieldName, [...new Set(currentEmails.concat(newEntries))], {
        shouldValidate: shouldValidateOnAdd || isSubmitted,
      })
    },
    [
      fieldName,
      delimiters,
      normalize,
      validate,
      shouldValidateOnAdd,
      isSubmitted,
      setValue,
      currentEmails,
    ],
  )

  return handleEmailsChange
}
