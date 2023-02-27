import { Chance } from 'chance'
import { gql, GraphQLClient } from 'graphql-request'

const hasuraSecret = process.env.SECRET ?? 'tth-hasura-key'
const hasuraEndpoint = process.env.ENDPOINT
  ? `${process.env.ENDPOINT}/v1/graphql`
  : 'http://localhost:8080/v1/graphql'

if (!hasuraSecret || !hasuraEndpoint) {
  console.log('Hasura secret and endpoint is needed for seeding orders')
  process.exit(1)
}

const chance = new Chance()

const hasuraClient = new GraphQLClient(hasuraEndpoint, {
  headers: {
    'x-hasura-admin-secret': hasuraSecret,
    'x-hasura-user-id': '22015a3e-8907-4333-8811-85f782265a63', // adm@teamteach.testinator.com
  },
})

const orders = [
  {
    courseId: 10012,
    organizationId: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
    billingAddress: chance.address(),
    billingEmail: 'seed.billing1@teamteach.testinator.com',
    billingFamilyName: 'Doe',
    billingGivenName: 'John',
    billingPhone: '+44 1111 11111',
    clientPurchaseOrder: '',
    paymentMethod: 'INVOICE',
    promoCodes: [],
    quantity: 2,
    registrants: [
      'seed.registrant1@teamteach.testinator.com',
      'seed.registrant2@teamteach.testinator.com',
    ],
  },
  {
    courseId: 10012,
    organizationId: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
    billingAddress: chance.address(),
    billingEmail: 'seed.billing2@teamteach.testinator.com',
    billingFamilyName: 'Doe',
    billingGivenName: 'Jane',
    billingPhone: '+44 1111 11111',
    clientPurchaseOrder: '',
    paymentMethod: 'INVOICE',
    promoCodes: ['CODE_5%_ALL'],
    quantity: 2,
    registrants: [
      'seed.registrant3@teamteach.testinator.com',
      'seed.registrant4@teamteach.testinator.com',
    ],
  },
]

async function seed() {
  const MUTATION = gql`
    mutation SeedOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
      }
    }
  `
  try {
    await Promise.all(
      orders.map(order => hasuraClient.request(MUTATION, { input: order }))
    )
  } catch (err) {
    // Hasura is returning an error but the action is successfully called
    // The createOrder action is expecting user_id for creating an order
    // but the hasura is expecting a valid token, but calls the action
    if (!err.message?.includes('The security token included')) {
      throw err
    }
  }

  console.log('Orders seeded successfully!')
}

seed()
