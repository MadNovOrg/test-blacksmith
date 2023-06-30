import { Organization } from './types'

export const UNIQUE_ORGANIZATION: () => Organization = () => ({
  name: 'Test organization',
  address: {
    line1: 'Tankfield',
    line2: 'Convent Hill',
    city: 'Tramore',
    state: 'Waterford',
    postCode: 'X91 PV08',
    country: 'Ireland',
  },
  go1Licenses: 10,
})
