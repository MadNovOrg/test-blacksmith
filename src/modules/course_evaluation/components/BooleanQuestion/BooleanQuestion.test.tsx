import { yupResolver } from '@hookform/resolvers/yup'
import React, { PropsWithChildren } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { noop } from 'ts-essentials'
import { InferType } from 'yup'

import { Course_Evaluation_Question_Type_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'

import { render, screen, userEvent } from '@test/index'

import { BooleanQuestion } from './index'

const schema = yup.object({
  noResponse: yup.string().required(),
  yesResponse: yup.string().required(),
})

// eslint-disable-next-line react/prop-types
const FormWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm<InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      noResponse: '',
      yesResponse: '',
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

describe('BooleanQuestion component', () => {
  it('renders BooleanQuestionReasonYes', async () => {
    const type = Course_Evaluation_Question_Type_Enum.BooleanReasonY
    const value = 'YES'
    const reason = 'my reason'
    const infoText = 'info text'
    render(
      <FormWrapper>
        <BooleanQuestion
          type={type}
          value={value}
          reason={reason}
          infoText={infoText}
        />
      </FormWrapper>
    )
    userEvent.click(screen.getByTestId('rating-yes'))
    expect(screen.getByTestId('rating-boolean-reason-yes')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('info text')).toBeInTheDocument()
  })
  it('renders BooleanQuestionReasonNo', async () => {
    const type = Course_Evaluation_Question_Type_Enum.BooleanReasonN
    const value = 'NO'
    const reason = 'reason'
    const infoText = 'information text'
    render(
      <FormWrapper>
        <BooleanQuestion
          type={type}
          value={value}
          reason={reason}
          infoText={infoText}
        />
      </FormWrapper>
    )
    userEvent.click(screen.getByTestId('rating-no'))
    expect(screen.getByTestId('rating-boolean-reason-no')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('information text')).toBeInTheDocument()
  })
})
