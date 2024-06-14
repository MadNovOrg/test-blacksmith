import { Box } from '@mui/material'
import { ComponentProps } from 'react'

import theme from '@app/theme'

import { CountPanel } from '../CountPanel'

type Props = ComponentProps<typeof CountPanel> & {
  onClick: () => void
  selected: boolean
}

export const SelectableCountPanel: React.FC<Props> = ({
  onClick,
  selected,
  ...props
}) => {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        border: 2,
        borderColor: 'white',
        ...(selected ? { borderColor: theme.palette.primary.main } : undefined),
      }}
      onClick={onClick}
    >
      <CountPanel {...props} />
    </Box>
  )
}
