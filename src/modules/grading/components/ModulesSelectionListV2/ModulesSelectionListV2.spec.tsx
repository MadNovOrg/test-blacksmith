import { _render, screen, userEvent, within } from '@test/index'

import { buildModule, buildLesson } from '../../utils'

import { ModulesSelectionListV2 } from './ModulesSelectionListV2'

const user = userEvent.setup()

it('renders module and lessons within modules', () => {
  const module = buildModule({ name: 'Theory' })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${module.id}`),
  ).getByTestId('accordion-summary')

  expect(
    within(moduleAccordion).getByLabelText(module.name),
  ).toBeInTheDocument()

  expect(
    screen.getByLabelText(module.lessons.items[0].name),
  ).toBeInTheDocument()
})

it('toggles lesson selection within module when lesson is clicked', async () => {
  const module = buildModule({ name: 'Theory' })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const lessonCheckbox = screen.getByLabelText(module.lessons.items[0].name)

  await user.click(lessonCheckbox)

  expect(lessonCheckbox).toBeChecked()
})

it('toggles whole module when module is clicked', async () => {
  const module = buildModule({
    name: 'Theory',
    lessons: {
      items: [
        buildLesson({ name: 'Lesson 1' }),
        buildLesson({ name: 'Lesson 2' }),
      ],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${module.id}`),
  ).getByTestId('accordion-summary')

  const moduleCheckbox = within(moduleAccordion).getByLabelText('Theory')

  await user.click(moduleCheckbox)

  expect(moduleCheckbox).toBeChecked()

  module.lessons?.items?.forEach((lesson: { name: string }) => {
    expect(screen.getByLabelText(lesson.name)).toBeChecked()
  })

  await user.click(moduleCheckbox)

  expect(moduleCheckbox).not.toBeChecked()

  module.lessons?.items?.forEach((lesson: { name: string }) => {
    expect(screen.getByLabelText(lesson.name)).not.toBeChecked()
  })
})

it('marks module as indeterminate if only some lessons are checked within the module', async () => {
  const module = buildModule({
    name: 'Theory',
    lessons: {
      items: [
        buildLesson({ name: 'Lesson 1' }),
        buildLesson({ name: 'Lesson 2' }),
      ],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${module.id}`),
  ).getByTestId('accordion-summary')

  const moduleCheckbox = within(moduleAccordion).getByLabelText(module.name)

  await user.click(screen.getByLabelText(module.lessons.items[0].name))

  expect(moduleCheckbox).toHaveAttribute('data-indeterminate', 'true')
})

it('disables whole module if module is mandatory', () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: true,
    lessons: {
      items: [
        buildLesson({ name: 'Lesson 1' }),
        buildLesson({ name: 'Lesson 2' }),
      ],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${module.id}`),
  ).getByTestId('accordion-summary')

  const moduleCheckbox = within(moduleAccordion).getByLabelText(module.name)

  expect(moduleCheckbox).toBeDisabled()
  expect(moduleCheckbox).toBeChecked()

  module.lessons.items?.forEach((lesson: { name: string }) => {
    const lessonCheckbox = screen.getByLabelText(lesson.name)
    expect(lessonCheckbox).toBeDisabled()
    expect(lessonCheckbox).toBeChecked()
  })
})

it('toggles lesson group when clicked', async () => {
  const childLesson = buildLesson({ name: 'Child lesson 1' })
  const parentLesson = buildLesson({ name: 'Lesson 1', items: [childLesson] })

  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: {
      items: [parentLesson],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const parentLessonCheckbox = screen.getByLabelText(parentLesson.name)
  const childLessonCheckbox = screen.getByLabelText(childLesson.name)

  expect(parentLessonCheckbox).not.toBeChecked()
  expect(childLessonCheckbox).not.toBeChecked()

  await user.click(parentLessonCheckbox)

  expect(parentLessonCheckbox).toBeChecked()
  expect(childLessonCheckbox).toBeChecked()

  await user.click(parentLessonCheckbox)

  expect(parentLessonCheckbox).not.toBeChecked()
  expect(childLessonCheckbox).not.toBeChecked()
})

it('marks lesson group as indeterminate if some child lessons are selected', async () => {
  const childLessonOne = buildLesson({ name: 'Child lesson 1' })
  const childLessonTwo = buildLesson({ name: 'Child lesson 2' })

  const parentLesson = buildLesson({
    name: 'Lesson 1',
    items: [childLessonOne, childLessonTwo],
  })

  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: {
      items: [parentLesson],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const parentLessonCheckbox = screen.getByLabelText(parentLesson.name)
  const childLessonOneCheckbox = screen.getByLabelText(childLessonOne.name)
  const childLessonTwoCheckbox = screen.getByLabelText(childLessonTwo.name)

  expect(parentLessonCheckbox).toHaveAttribute('data-indeterminate', 'false')

  await user.click(childLessonOneCheckbox)

  expect(parentLessonCheckbox).toHaveAttribute('data-indeterminate', 'true')

  await user.click(childLessonTwoCheckbox)

  expect(parentLessonCheckbox).toHaveAttribute('data-indeterminate', 'false')
})

it('toggles child lesson within lesson group', async () => {
  const childLessonOne = buildLesson({ name: 'Child lesson 1' })

  const parentLesson = buildLesson({
    name: 'Lesson 1',
    items: [childLessonOne],
  })

  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: {
      items: [parentLesson],
    },
  })

  const curriculum = [module]

  _render(<ModulesSelectionListV2 curriculum={curriculum} />)

  const childLessonOneCheckbox = screen.getByLabelText(childLessonOne.name)

  await user.click(childLessonOneCheckbox)
  expect(childLessonOneCheckbox).toBeChecked()
})

it('calls onChange whenever a module is toggled', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: {
      items: [buildLesson({ name: 'Lesson 1' })],
    },
  })

  const curriculum = [module]
  const onChange = vitest.fn()

  _render(
    <ModulesSelectionListV2 curriculum={curriculum} onChange={onChange} />,
  )

  expect(onChange).toHaveBeenCalledWith([
    {
      ...module,
      lessons: {
        items: module.lessons.items.map((l: { name: string }) => ({
          ...l,
          covered: false,
        })),
      },
    },
  ])

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${module.id}`),
  ).getByTestId('accordion-summary')

  await user.click(within(moduleAccordion).getByLabelText(module.name))

  expect(onChange).toHaveBeenCalledWith([
    {
      ...module,
      lessons: {
        items: module.lessons.items.map((l: { name: string }) => ({
          ...l,
          covered: true,
        })),
      },
    },
  ])
})

it('calls onChange whenever a lesson is toggled', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: {
      items: [buildLesson({ name: 'Lesson 1' })],
    },
  })

  const curriculum = [module]
  const onChange = vitest.fn()

  _render(
    <ModulesSelectionListV2 curriculum={curriculum} onChange={onChange} />,
  )

  expect(onChange).toHaveBeenCalledWith([
    {
      ...module,
      lessons: {
        items: module.lessons.items.map((l: { name: string }) => ({
          ...l,
          covered: false,
        })),
      },
    },
  ])

  await user.click(screen.getByLabelText(module.lessons.items[0].name))

  expect(onChange).toHaveBeenCalledWith([
    {
      ...module,
      lessons: {
        items: module.lessons.items.map((l: { name: string }) => ({
          ...l,
          covered: true,
        })),
      },
    },
  ])
})
