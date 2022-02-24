import React from 'react'
import clsx from 'clsx'

export type ProgressBarProps = {
  percentage: number
  label?: string
  textColor?: string
  fillColor?: string
  bgColor?: string
  warnColor?: string
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = function ({
  percentage,
  label,
  textColor = 'text-white',
  fillColor = 'bg-teal-500',
  bgColor = 'bg-gray-100',
  warnColor = 'bg-red',
  className,
}) {
  const rounded = Math.floor(percentage)
  return (
    <div className={clsx(className, bgColor, textColor, 'w-full h-6 relative')}>
      <div
        className={clsx(
          'h-full',
          percentage > 100 ? warnColor : fillColor,
          `w-[${Math.min(rounded, 100)}%]`
        )}
      />
      <span className="absolute bottom-1 left-1 text-xs">
        {label ? label : `${rounded}%`}
      </span>
    </div>
  )
}

export default ProgressBar
