import { TabList } from '@mui/lab'
import { styled, Tab, tabClasses } from '@mui/material'

export const PillTabList = styled(TabList)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  minHeight: theme.spacing(5),

  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

export const PillTab = styled(Tab)(({ theme }) => ({
  minHeight: theme.spacing(4),
  height: theme.spacing(4),

  '& + &': {
    marginLeft: theme.spacing(3),
  },

  [`&.${tabClasses.selected}`]: {
    background: theme.palette.grey[100],
    borderRadius: theme.spacing(0.5),
    ...theme.typography.body1,
    fontWeight: '500',
    border: 0,
  },
}))
