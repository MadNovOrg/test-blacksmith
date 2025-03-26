import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import { InvoiceDetails } from '.'

import withMuiThemeProvider from '@storybook-decorators/withMuiThemeProvider'

export default {
  title: 'components/InvoiceDetails',
  component: InvoiceDetails,
  decorators: [withMuiThemeProvider],
} as Meta<typeof InvoiceDetails>

const Template: StoryFn<typeof InvoiceDetails> = args => (
  <InvoiceDetails {...args} />
)

export const Default = Template.bind({})
Default.args = {
  details: {
    orgId: '',
    orgName: '',
    billingAddress: 'Pebbles Care Limited, Dunfermline, UK',
    firstName: 'Richard',
    surname: 'Whitelam',
    email: 'richard.whitelam@pebblescare.com',
    phone: '(+44) 1133 203556',
    purchaseOrder: '',
  },
}
