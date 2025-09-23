import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useMountedState } from 'react-use'

type ExpireProps = {
  children: React.ReactNode
  delay: number
}

export const Expire: React.FC<React.PropsWithChildren<ExpireProps>> = ({
  children,
  delay,
}) => {
  const isMounted = useMountedState()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      if (isMounted()) setVisible(false)
    }, delay)
  }, [delay, isMounted])

  return visible ? <Box>{children}</Box> : null
}
