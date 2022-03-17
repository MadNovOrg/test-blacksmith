import React from 'react'

import { ModulesSelectionList, Props } from '.'

import { render, chance, screen, within, userEvent } from '@test/index'

describe('component: ModulesSelectionList', () => {
  it('renders module groups and modules within groups', () => {
    const moduleGroups: Props['moduleGroups'] = [
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: false },
        ],
      },
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: true },
        ],
      },
    ]

    render(<ModulesSelectionList moduleGroups={moduleGroups} />)

    moduleGroups.forEach(moduleGroup => {
      const groupElement = screen.getByTestId(`module-group-${moduleGroup.id}`)

      expect(screen.getByText(moduleGroup.name)).toBeInTheDocument()

      moduleGroup.modules.forEach(module => {
        const moduleCheckbox = within(groupElement).getByLabelText(module.name)

        if (module.covered) {
          expect(moduleCheckbox).toBeChecked()
        } else {
          expect(moduleCheckbox).not.toBeChecked()
        }
      })
    })
  })

  it('toggles module selection within module group when module item is clicked', () => {
    const moduleGroups: Props['moduleGroups'] = [
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: false },
        ],
      },
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: true },
        ],
      },
    ]

    const onChangeMock = jest.fn()

    render(
      <ModulesSelectionList
        moduleGroups={moduleGroups}
        onChange={onChangeMock}
      />
    )

    userEvent.click(screen.getByLabelText(moduleGroups[0].modules[0].name))

    expect(
      screen.getByLabelText(moduleGroups[0].modules[0].name)
    ).not.toBeChecked()

    expect(onChangeMock.mock.calls[0][0]).toEqual({
      [moduleGroups[0].modules[0].id]: false,
      [moduleGroups[0].modules[1].id]: false,
      [moduleGroups[1].modules[0].id]: true,
      [moduleGroups[1].modules[1].id]: true,
    })

    userEvent.click(screen.getByLabelText(moduleGroups[0].modules[0].name))

    expect(screen.getByLabelText(moduleGroups[0].modules[0].name)).toBeChecked()

    expect(onChangeMock.mock.calls[1][0]).toEqual({
      [moduleGroups[0].modules[0].id]: true,
      [moduleGroups[0].modules[1].id]: false,
      [moduleGroups[1].modules[0].id]: true,
      [moduleGroups[1].modules[1].id]: true,
    })

    expect(onChangeMock).toHaveBeenCalledTimes(2)
  })

  it('toggles whole module group when module group item is clicked', () => {
    const moduleGroups: Props['moduleGroups'] = [
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: false },
        ],
      },
      {
        id: chance.guid(),
        name: chance.name(),
        modules: [
          { id: chance.guid(), name: chance.name(), covered: true },
          { id: chance.guid(), name: chance.name(), covered: true },
        ],
      },
    ]

    const onChangeMock = jest.fn()

    render(
      <ModulesSelectionList
        moduleGroups={moduleGroups}
        onChange={onChangeMock}
      />
    )

    userEvent.click(screen.getByLabelText(moduleGroups[1].name))

    expect(screen.getByLabelText(moduleGroups[1].name)).not.toBeChecked()

    expect(onChangeMock.mock.calls[0][0]).toEqual({
      [moduleGroups[0].modules[0].id]: true,
      [moduleGroups[0].modules[1].id]: false,
      [moduleGroups[1].modules[0].id]: false,
      [moduleGroups[1].modules[1].id]: false,
    })

    userEvent.click(screen.getByLabelText(moduleGroups[1].name))

    expect(screen.getByLabelText(moduleGroups[1].name)).toBeChecked()

    expect(onChangeMock.mock.calls[1][0]).toEqual({
      [moduleGroups[0].modules[0].id]: true,
      [moduleGroups[0].modules[1].id]: false,
      [moduleGroups[1].modules[0].id]: true,
      [moduleGroups[1].modules[1].id]: true,
    })
  })
})
