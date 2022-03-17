import React, { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/system'

import { noop } from '@app/util'
import theme from '@app/theme'

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  border: 'none',
  backgroundColor: theme.palette.common.white,
  boxShadow: 'none',

  '& .MuiButtonBase-root': {
    padding: '2px 10px 2px 5px',
    alignItems: 'center',
  },

  ':before': {
    display: 'none',
  },
}))

type HoldsRecord = Record<string, boolean>

export interface Props {
  moduleGroups: Array<{
    id: string
    name: string
    modules: Array<{ id: string; name: string; covered: boolean }>
  }>
  onChange?: (holds: HoldsRecord) => void
}

export const ModulesSelectionList: React.FC<Props> = ({
  moduleGroups,
  onChange = noop,
}) => {
  const [holds, setHolds] = useState<HoldsRecord>(() => {
    const holds: HoldsRecord = {}

    moduleGroups.forEach(group => {
      group.modules.forEach(module => {
        holds[module.id] = module.covered
      })
    })

    return holds
  })

  const checkedGroups: string[] = useMemo(() => {
    const checked: string[] = []

    moduleGroups.forEach(group => {
      const uncheckedModule = group.modules.find(
        module => holds[module.id] === false
      )

      if (!uncheckedModule) {
        checked.push(group.id)
      }
    })

    return checked
  }, [holds, moduleGroups])

  const toggleModuleHold = (moduleId: string) => {
    const newHolds = {
      ...holds,
      [moduleId]: !holds[moduleId],
    }

    setHolds(newHolds)
    onChange(newHolds)
  }

  const toggleModuleGroupChange = (groupId: string) => {
    const moduleGroup = moduleGroups.find(group => group.id === groupId)

    const unCheckedGroupModules = moduleGroup?.modules.filter(
      module => holds[module.id] === false
    )

    const groupChecked = unCheckedGroupModules?.length === 0

    const groupHolds: HoldsRecord = {}

    moduleGroup?.modules.forEach(module => {
      groupHolds[module.id] = !groupChecked
    })

    const newHolds = { ...holds, ...groupHolds }

    setHolds(newHolds)
    onChange(newHolds)
  }

  return (
    <>
      {moduleGroups.map(group => (
        <StyledAccordion
          key={group.id}
          defaultExpanded
          disableGutters
          sx={{ marginBottom: 1 }}
          data-testid={`module-group-${group.id}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <FormGroup key={group.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedGroups.includes(group.id)}
                    onChange={() => {
                      toggleModuleGroupChange(group.id)
                    }}
                  />
                }
                label={
                  <Typography
                    color={
                      checkedGroups.includes(group.id)
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary
                    }
                    fontWeight={600}
                  >
                    {group.name}
                  </Typography>
                }
              />
            </FormGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingLeft: 4.5 }}>
            {group.modules.map(module => (
              <FormGroup key={module.id} sx={{ marginBottom: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => toggleModuleHold(module.id)}
                      checked={holds[module.id]}
                    />
                  }
                  label={
                    <Typography
                      color={
                        holds[module.id]
                          ? theme.palette.text.primary
                          : theme.palette.text.secondary
                      }
                    >
                      {module.name}
                    </Typography>
                  }
                />
              </FormGroup>
            ))}
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </>
  )
}
