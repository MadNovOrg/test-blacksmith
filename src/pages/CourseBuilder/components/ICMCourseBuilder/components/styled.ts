import styled from '@emotion/styled'
import { AccordionDetails, AccordionSummary } from '@mui/material'

import theme from '@app/theme'

export const StyledAccordionSummary = styled(AccordionSummary)({
  py: 0,
  backgroundColor: 'primary.main',
  color: 'white',
  borderRadius: 8,
  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
})

export const StyledAccordionDetails = styled(AccordionDetails)({
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'primary.main',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  borderTopWidth: 0,
  padding: theme.spacing(2),
})
