import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'

import theme from '@app/theme'
import { noop } from '@app/util'

export type HoldsRecord = Record<string, boolean>

export interface Props {
  moduleGroups: Array<{
    id: string
    name: string
    mandatory: boolean
    modules: Array<{
      id: string
      name: string
      covered: boolean
    }>
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
      {moduleGroups.map(group => {
        const groupIsMandatory = group.mandatory
        const groupIsChecked = checkedGroups.includes(group.id)
        const isIndeterminate =
          !groupIsChecked &&
          group.modules.findIndex(module => holds[module.id] === true) >= 0

        return (
          <Accordion
            key={group.id}
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
                      checked={groupIsChecked || groupIsMandatory || false}
                      indeterminate={isIndeterminate}
                      onChange={() => {
                        toggleModuleGroupChange(group.id)
                      }}
                      onClick={e => e.stopPropagation()}
                      disabled={groupIsMandatory}
                    />
                  }
                  label={
                    <Typography
                      color={
                        groupIsChecked
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
            <AccordionDetails sx={{ paddingLeft: 4 }}>
              {group.modules.map(module => (
                <FormGroup key={module.id} sx={{ marginBottom: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => toggleModuleHold(module.id)}
                        checked={holds[module.id] || groupIsMandatory || false}
                        disabled={groupIsMandatory}
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
          </Accordion>
        )
      })}
    </>
  )
}
