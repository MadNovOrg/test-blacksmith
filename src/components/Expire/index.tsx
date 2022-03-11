import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

type ExpireProps = {
  children: React.ReactNode
  delay: number
}

export const Expire: React.FC<ExpireProps> = ({ children, delay }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setVisible(false)
    }, delay)
  }, [delay])

  return visible ? <Box>{children}</Box> : null
}
