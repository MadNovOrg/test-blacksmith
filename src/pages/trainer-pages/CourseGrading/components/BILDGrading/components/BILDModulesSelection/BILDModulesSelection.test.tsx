import React from 'react'

import { render, screen, userEvent, within } from '@test/index'

import { Strategy } from '../../types'

import { BILDModulesSelection } from '.'

describe('component: BILDModulesSelection', () => {
  it('marks strategies and modules as initially selected', () => {
    const strategyModules: Record<string, Strategy> = {
      PRIMARY: {
        modules: [{ name: 'Module name' }],
        groups: [],
      },
      SECONDARY: {
        groups: [
          { name: 'Group', modules: [{ name: 'Module within a group' }] },
        ],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={jest.fn()}
      />
    )

    const primaryStrategyAccordion = screen.getByTestId(
      'strategy-accordion-PRIMARY'
    )

    expect(
      within(primaryStrategyAccordion).getByTestId('strategy-checkbox-PRIMARY')
    ).toBeChecked()

    expect(
      within(primaryStrategyAccordion).getByTestId('strategy-checkbox-PRIMARY')
    ).toBeDisabled()

    expect(
      within(primaryStrategyAccordion).getByLabelText('Module name')
    ).toBeChecked()

    expect(
      within(primaryStrategyAccordion).getByLabelText('Module name')
    ).toBeDisabled()

    const secondaryStrategyAccordion = screen.getByTestId(
      'strategy-accordion-SECONDARY'
    )

    expect(
      within(secondaryStrategyAccordion).getByTestId(
        'strategy-checkbox-SECONDARY'
      )
    ).toBeChecked()

    expect(
      within(secondaryStrategyAccordion).getByTestId(
        'strategy-checkbox-SECONDARY'
      )
    ).toBeDisabled()

    expect(
      within(secondaryStrategyAccordion).getByLabelText('Module within a group')
    ).toBeChecked()

    expect(
      within(secondaryStrategyAccordion).getByLabelText('Module within a group')
    ).toBeDisabled()
  })

  it('marks a strategy as partially selected', async () => {
    const strategyModules: Record<string, Strategy> = {
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module' }, { name: 'Second module' }],
        groups: [],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={jest.fn()}
      />
    )

    await userEvent.click(screen.getByLabelText('First module'))

    expect(
      screen.getByTestId('strategy-checkbox-NON_TERTIARY_RESTRICTED')
    ).toHaveAttribute('data-indeterminate', 'true')
  })

  it('toggles strategy selection', async () => {
    const strategyModules: Record<string, Strategy> = {
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module' }],
        groups: [{ name: 'Group', modules: [{ name: 'Group module' }] }],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={jest.fn()}
      />
    )

    const strategyCheckbox = screen.getByTestId(
      'strategy-checkbox-NON_TERTIARY_RESTRICTED'
    )

    await userEvent.click(strategyCheckbox)

    expect(screen.getByLabelText('First module')).not.toBeChecked()
    expect(screen.getByLabelText('Group module')).not.toBeChecked()

    await userEvent.click(strategyCheckbox)

    expect(screen.getByLabelText('First module')).toBeChecked()
    expect(screen.getByLabelText('Group module')).toBeChecked()
  })

  it('toggles module selection', async () => {
    const strategyModules: Record<string, Strategy> = {
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module' }],
        groups: [{ name: 'Group', modules: [{ name: 'Group module' }] }],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={jest.fn()}
      />
    )

    const module = screen.getByLabelText(/first module/i)

    await userEvent.click(module)
    expect(module).not.toBeChecked()

    await userEvent.click(module)
    expect(module).toBeChecked()
  })

  it('marks mandatory modules within strategy as selected and disabled', async () => {
    const strategyModules: Record<string, Strategy> = {
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module', mandatory: true }],
        groups: [
          {
            name: 'Group',
            modules: [{ name: 'Second module', mandatory: true }],
          },
        ],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={jest.fn()}
      />
    )

    const mandatoryModule = screen.getByLabelText(/first module/i)
    const nestedMandatoryModule = screen.getByLabelText(/second module/i)

    expect(mandatoryModule).toBeChecked()
    expect(mandatoryModule).toBeDisabled()

    expect(nestedMandatoryModule).toBeChecked()
    expect(nestedMandatoryModule).toBeDisabled()
  })

  it('calls a callback with the selection make', async () => {
    const onChangeMock = jest.fn()

    const strategyModules: Record<string, Strategy> = {
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module' }],
        groups: [
          {
            name: 'Group',
            modules: [{ name: 'Second module' }],
          },
        ],
      },
      ADVANCED: {
        groups: [
          { name: 'Second group', modules: [{ name: 'Second group module' }] },
        ],
      },
    }

    render(
      <BILDModulesSelection
        strategyModules={strategyModules}
        onChange={onChangeMock}
      />
    )

    await userEvent.click(screen.getByLabelText(/second module/i))

    expect(onChangeMock).toHaveBeenLastCalledWith({
      NON_TERTIARY_RESTRICTED: {
        modules: [{ name: 'First module' }],
        groups: [],
      },
      ADVANCED: {
        groups: [
          { name: 'Second group', modules: [{ name: 'Second group module' }] },
        ],
        modules: [],
      },
    })
  })
})
