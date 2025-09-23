import Backdrop from '@mui/material/Backdrop'
import React, { useState, useLayoutEffect } from 'react'

interface SpotlightProps {
  open: boolean
  positionTargetId: string
  children: React.ReactNode
}

const Spotlight: React.FC<SpotlightProps> = ({
  open,
  positionTargetId,
  children,
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    let tries = 0
    const maxTries = 20
    const interval = setInterval(() => {
      const el = document.getElementById(positionTargetId)
      if (el) {
        setTargetRect(el.getBoundingClientRect())
        clearInterval(interval)
      } else if (++tries >= maxTries) {
        clearInterval(interval)
        console.warn(`#${positionTargetId} not found after retries`)
      }
    }, 100)

    return () => {
      document.body.style.overflow = ''
      clearInterval(interval)
    }
  }, [open, positionTargetId])

  if (!open || !targetRect) return null

  const { top, left } = targetRect

  return (
    <Backdrop open={open} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <div
        style={{
          backgroundColor: 'white',
          left,
          pointerEvents: 'auto',
          position: 'fixed',
          top,
          zIndex: 9999,
        }}
      >
        {children}
      </div>
    </Backdrop>
  )
}

export default Spotlight
