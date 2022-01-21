import React from 'react'
import clsx from 'clsx'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  value?: string | number
  error?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  label,
  className,
  value,
  error,
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
          'border-b-2 focus:outline-0 block w-full pb-1.5',
          {
            'focus:border-lime1': !error,
            'border-red': !!error,
            'border-grey5': !value && !error,
            'border-navy': value && !error,
          },
          className
        )}
        {...props}
      />
      {error && <div className="text-xs text-red mt-2">{error}</div>}
    </div>
  )
}
