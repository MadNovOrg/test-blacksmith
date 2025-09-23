import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { ModuleObject } from '../../pages/CourseCertification/types'
import { UncompletedList } from '../UncompletedList/UncompletedList'

type ModuleGroupAccordionProps = {
  moduleGroupName: string
  completedModules: ModuleObject[]
  uncompletedModules: ModuleObject[]
}

export const ModuleGroupAccordion: React.FC<
  React.PropsWithChildren<ModuleGroupAccordionProps>
> = ({ moduleGroupName, completedModules, uncompletedModules }) => {
  const [expanded, setExpanded] = useState<string | false>(false)

  const totalModules = completedModules.length + uncompletedModules.length

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            variant="subtitle2"
            sx={{ width: { sm: '60%', md: '70%' }, flexShrink: 0, mt: -0.5 }}
          >
            {moduleGroupName}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {`${completedModules.length} of ${totalModules} completed`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {completedModules.map(module => (
            <Typography key={module.name} variant="body1" gutterBottom>
              {module.name}
            </Typography>
          ))}
          {uncompletedModules.length ? (
            <UncompletedList uncompletedModules={uncompletedModules} />
          ) : null}
        </AccordionDetails>
      </Accordion>
      <Divider />
    </>
  )
}
