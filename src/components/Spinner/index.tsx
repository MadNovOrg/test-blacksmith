import React, { SVGAttributes } from 'react'

export type SpinnerProps = {
  cls: string
  circle?: SVGAttributes<SVGCircleElement>
  svg?: React.SVGProps<SVGSVGElement>
}

const Spinner: React.FC<SpinnerProps> = function ({
  cls,
  circle = {},
  svg = {},
}) {
  return (
    <svg className={`spinner ${cls}`} viewBox="0 0 50 50" {...svg}>
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        stroke="currentColor"
        {...circle}
      ></circle>
    </svg>
  )
}

export default Spinner
