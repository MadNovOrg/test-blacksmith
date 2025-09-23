import { Accordion, styled } from '@mui/material'

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: 'transparent',
  '&.Mui-expanded': { margin: 0 },

  '&:first-of-type': { borderRadius: 0 },
  '&:last-of-type': { borderRadius: 0 },

  '.MuiAccordionSummary-root': {
    padding: 0,
    minHeight: theme.spacing(5),
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    '&.Mui-expanded': {
      margin: 0,
      minHeight: theme.spacing(5),
    },
  },
  '.MuiAccordionSummary-content': {
    margin: 0,
    padding: 0,
    fontSize: '.95rem',
    color: theme.palette.grey[800],
    '&.Mui-expanded': { margin: 0 },
  },

  '.MuiAccordionDetails-root': {
    padding: 0,
    background: theme.palette.grey[50],
  },
  '.MuiListItemButton-root': {
    padding: '.4em',
    minHeight: theme.spacing(5),
    '.MuiListItemText-root': {
      margin: 0,
    },
    '.MuiTypography-root': {
      fontSize: '.9rem',
    },
    '.MuiListItemIcon-root': {
      color: 'rgba(0,0,0,.42)',
      opacity: 0,
      justifyContent: 'flex-end',
      marginLeft: theme.spacing(2),
      minWidth: 0,
      '.MuiSvgIcon-root': {
        fontSize: '1.2rem',
      },
    },
    '&.selected': {
      '.MuiTypography-root': {
        fontWeight: '600',
      },
      '.MuiListItemIcon-root': {
        opacity: 1,
      },
    },
  },
}))
