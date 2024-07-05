import { isFuture, parseISO } from 'date-fns'
import { gql, GraphQLClient } from 'graphql-request'
const hasuraSecret = process.env.SECRET ?? 'tth-hasura-key'
const hasuraEndpoint = process.env.ENDPOINT
  ? `${process.env.ENDPOINT}/v1/graphql`
  : 'http://localhost:8080/v1/graphql'

if (!hasuraSecret || !hasuraEndpoint) {
  console.log('Hasura secret and endpoint is needed for updating course price')
  process.exit(1)
}

const hasuraClient = new GraphQLClient(hasuraEndpoint, {
  headers: {
    'x-hasura-admin-secret': hasuraSecret,
  },
})

type CoursePriceType = {
  course_pricing: {
    id: number
    type: string
    level: string
    priceAmount: number
    priceCurrency: string
    reaccreditation: boolean
    blended: boolean
  }[]
}

type CoursePriceSchedule = {
  course_pricing_schedule: {
    priceAmount: number
    coursePricingId: number
    priceCurrency: string
    effectiveFrom: string
    effectiveTo: string
  }[]
}

type SingleCoursePrice = {
  price: number
  priceCurrency: string
  includeVAT: boolean
  type: string
  level: string
  reaccreditation: boolean
  go1Integration: boolean
}

const GET_COURSE_PRICING_QUERY = gql`
  query course_pricing {
    course_pricing {
      id
      level
      priceAmount
      priceCurrency
      type
      reaccreditation
      blended
    }
  }
`

const GET_PRICING_SCHEDULE_QUERY = gql`
  query CoursePricingSchedule {
    course_pricing_schedule {
      priceAmount
      coursePricingId
      priceCurrency
      effectiveFrom
      effectiveTo
    }
  }
`

const UPDATE_COURSE_PRICE_MUTATION = gql`
  mutation updateCoursePrice(
    $price: numeric!
    $priceCurrency: String!
    $includeVAT: Boolean!
    $type: course_type_enum!
    $level: course_level_enum!
    $reaccrediation: Boolean!
    $go1Integration: Boolean!
  ) {
    update_course(
      where: {
        price: { _is_null: true }
        type: { _eq: $type }
        level: { _eq: $level }
        reaccreditation: { _eq: $reaccrediation }
        go1Integration: { _eq: $go1Integration }
      }
      _set: {
        price: $price
        priceCurrency: $priceCurrency
        includeVAT: $includeVAT
      }
    ) {
      returning {
        id
        name
        price
      }
    }
  }
`

async function updateCoursePrice() {
  try {
    const coursePrices: CoursePriceType = await hasuraClient.request(
      GET_COURSE_PRICING_QUERY,
    )

    const coursePricesSchedule: CoursePriceSchedule =
      await hasuraClient.request(GET_PRICING_SCHEDULE_QUERY)

    if (
      coursePrices.course_pricing.length !== 0 &&
      coursePricesSchedule.course_pricing_schedule.length !== 0
    ) {
      const prices = coursePrices.course_pricing
      const scheduledPrices = coursePricesSchedule.course_pricing_schedule

      const finalPrices: SingleCoursePrice[] = []

      prices.forEach(price => {
        scheduledPrices.forEach(scheduledPrice => {
          const priceEffectiveTo = scheduledPrice.effectiveTo
          const priceEnd = parseISO(priceEffectiveTo)

          if (
            price.id === scheduledPrice.coursePricingId &&
            isFuture(priceEnd)
          ) {
            finalPrices.push({
              price: scheduledPrice.priceAmount,
              priceCurrency: scheduledPrice.priceCurrency,
              includeVAT: true,
              type: price.type,
              level: price.level,
              reaccreditation: price.reaccreditation,
              go1Integration: price.blended,
            })
          } else {
            finalPrices.push({
              price: price.priceAmount,
              priceCurrency: price.priceCurrency,
              includeVAT: true,
              type: price.type,
              level: price.level,
              reaccreditation: price.reaccreditation,
              go1Integration: price.blended,
            })
          }
        })
      })

      try {
        await Promise.all(
          finalPrices.map(coursePrice => {
            const variables = {
              type: coursePrice.type,
              level: coursePrice.level,
              reaccrediation: coursePrice.reaccreditation,
              go1Integration: coursePrice.go1Integration,
              price: coursePrice.price,
              priceCurrency: coursePrice.priceCurrency,
              includeVAT: true,
            }
            hasuraClient.request(UPDATE_COURSE_PRICE_MUTATION, variables)
          }),
        )
        console.log('Course price update succefully')
      } catch (updatePriceError) {
        console.log('error updating course price', updatePriceError)
      }
    }
  } catch (error) {
    console.log('error getting course price', error)
  }
}

updateCoursePrice()
