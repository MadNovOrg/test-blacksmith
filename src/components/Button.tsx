import React from 'react'

type ButtonProps = {
  children: React.ReactNode
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="text-white rounded bg-navy2 hover:bg-navy px-5 py-2.5">
      {children}
    </button>
  )
}

export const SecondaryButton: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="text-white rounded bg-grey2 hover:bg-grey px-5 py-2.5">
      {children}
    </button>
  )
}

export const TertiaryButton: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="text-navy2 hover:text-navy rounded bg-white px-5 py-2.5 border">
      {children}
    </button>
  )
}
