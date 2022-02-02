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
        <label
          htmlFor={props.id || props.name}
          className={clsx('text-xs mb-1.5', {
            'text-red': !!error,
          })}
        >
          {label}
        </label>
      )}
      <input
        id={props.id || props.name}
        value={value}
        className={clsx(
          'focus:ring-0 border-b-2 border-t-0 border-l-0 border-r-0 focus:outline-0 block w-full pb-1.5 placeholder-gray-400',
          {
            'focus:border-lime-500': !error,
            'border-red': !!error,
            'border-gray-300': !value && !error,
            'border-navy-100': value && !error,
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
