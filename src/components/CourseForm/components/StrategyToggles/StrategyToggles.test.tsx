import { yupResolver } from '@hookform/resolvers/yup'
import { t } from 'i18next'
import { PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { noop } from 'ts-essentials'
import { InferType } from 'yup'

import { yup } from '@app/schemas'
import { CourseLevel } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import {
  StrategyToggles,
  defaultStrategies,
  schema as strategiesSchema,
  validateStrategies,
} from '.'

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

describe('component: StrategyToggles', () => {
  it('validates at least one strategy is selected', async () => {
    render(
      <FormWrapper>
        <StrategyToggles courseLevel={CourseLevel.BildRegular} />
      </FormWrapper>
    )

    expect(screen.queryByText(/form is valid/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/primary/i))

    expect(screen.getByText(/form is valid/i)).toBeInTheDocument()
  })
})
