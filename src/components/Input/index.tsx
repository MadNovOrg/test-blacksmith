import React from 'react'
import clsx from 'clsx'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  value?: string | number
  error?: string
  isPassword?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  label,
  className,
  value,
  error,
  isPassword = false,
  ...props
}) => {
  return (
    <div>
      {label && (
        <div
          className={clsx('text-xs mb-1.5', {
            'text-red': !!error,
          })}
        >
          {label}
        </div>
      )}
      <input
        value={value}
        className={clsx(
          'focus:ring-0 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-0 block w-full pb-1.5 placeholder-grey5',
          {
            'focus:border-lime1': !error,
            'border-red': !!error,
            'border-grey5': !value && !error,
            'border-navy1': value && !error,
            'pl-1': isPassword,
          },
          className
        )}
        {...props}
      />
      {error && <div className="text-xs text-red mt-2">{error}</div>}
    </div>
  )
}
