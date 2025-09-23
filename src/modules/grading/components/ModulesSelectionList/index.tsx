import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
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
      submodules:
        | Array<{
            id: string
            name: string
          }>
        | undefined
    }>
  }>
  onChange?: (holds: HoldsRecord) => void
  slots?: {
    afterModuleGroup: (groupId: string) => React.ReactNode
  }
}

export const ModulesSelectionList: React.FC<React.PropsWithChildren<Props>> = ({
  moduleGroups,
  onChange = noop,
  slots,
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
        module => holds[module.id] === false,
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
      module => holds[module.id] === false,
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
    <Stack spacing={1}>
      {moduleGroups.map(group => {
        const groupIsMandatory = group.mandatory
        const groupIsChecked = checkedGroups.includes(group.id)
        const isIndeterminate =
          !groupIsChecked &&
          group.modules.findIndex(module => holds[module.id] === true) >= 0

        return (
          <Box key={group.id}>
            <Accordion disableGutters data-testid={`module-group-${group.id}`}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <FormGroup key={group.id}>
                  <FormControlLabel
                    onClick={e => e.stopPropagation()}
                    control={
                      <Checkbox
                        checked={groupIsChecked || groupIsMandatory || false}
                        indeterminate={isIndeterminate}
                        onChange={() => {
                          toggleModuleGroupChange(group.id)
                        }}
                        disabled={groupIsMandatory}
                      />
                    }
                    label={
                      <Typography
                        component="span"
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
                          onClick={e => e.stopPropagation()}
                          checked={
                            holds[module.id] || groupIsMandatory || false
                          }
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
                    {module.submodules?.map(m => (
                      <FormControlLabel
                        key={m.name}
                        control={
                          <Checkbox
                            onChange={() => toggleModuleHold(module.id)}
                            onClick={e => e.stopPropagation()}
                            checked={
                              holds[module.id] || groupIsMandatory || false
                            }
                            sx={{ ml: 3 }}
                            disabled={groupIsMandatory}
                          />
                        }
                        label={
                          <Typography key={m.name} mb={1.5} ml={1} mt={1}>
                            {m.name}
                          </Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                ))}
              </AccordionDetails>
            </Accordion>

            {typeof slots?.afterModuleGroup === 'function'
              ? slots.afterModuleGroup(group.id)
              : null}
          </Box>
        )
      })}
    </Stack>
  )
}
