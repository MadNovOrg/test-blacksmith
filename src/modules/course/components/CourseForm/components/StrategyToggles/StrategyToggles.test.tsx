import { yupResolver } from '@hookform/resolvers/yup'
import { t } from 'i18next'
import { PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { noop } from 'ts-essentials'
import { InferType } from 'yup'

import { Course_Level_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'

import { _render, screen, userEvent } from '@test/index'

import {
  StrategyToggles,
  defaultStrategies,
  schema as strategiesSchema,
  validateStrategies,
} from './StrategyToggles'

const schema = yup.object({
  bildStrategies: validateStrategies(strategiesSchema, t),
})

// eslint-disable-next-line react/prop-types
const FormWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm<InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      bildStrategies: defaultStrategies,
    },
  })

  return (
    <FormProvider {...methods}>
      <>
        <form onSubmit={methods.handleSubmit(noop)}>
          {children}
          {methods.formState.isValid ? <p>form is valid</p> : null}
        </form>
      </>
    </FormProvider>
  )
}

it('validates at least one strategy is selected', async () => {
  _render(
    <FormWrapper>
      <StrategyToggles courseLevel={Course_Level_Enum.BildRegular} />
    </FormWrapper>,
  )

  expect(screen.queryByText(/form is valid/i)).not.toBeInTheDocument()

  await userEvent.click(screen.getByLabelText(/primary/i))

  expect(screen.getByText(/form is valid/i)).toBeInTheDocument()
})

it('deselects all strategies and disables toggles if course is trainer conversion', async () => {
  const { rerender } = _render(
    <FormWrapper>
      <StrategyToggles
        courseLevel={Course_Level_Enum.BildIntermediateTrainer}
      />
    </FormWrapper>,
  )

  rerender(
    <FormWrapper>
      <StrategyToggles
        courseLevel={Course_Level_Enum.BildIntermediateTrainer}
        isConversion={true}
      />
    </FormWrapper>,
  )

  expect(screen.getByLabelText(/primary/i)).toBeDisabled()
  expect(screen.getByLabelText(/primary/i)).not.toBeChecked()

  rerender(
    <FormWrapper>
      <StrategyToggles
        courseLevel={Course_Level_Enum.BildIntermediateTrainer}
        isConversion={false}
      />
    </FormWrapper>,
  )

  expect(screen.getByLabelText(/primary/i)).toBeDisabled()
  expect(screen.getByLabelText(/primary/i)).toBeChecked()
})
