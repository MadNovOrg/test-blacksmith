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

type CourseType = {
  course: {
    id: number
    type: string
    level: string
    go1Integration: boolean
    reaccreditation: boolean
  }[]
}

type CourseToUpdate = {
  price: number
  priceCurrency: string
  includeVAT: boolean
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

const GET_COURSES_QUERY = gql`
  query courses {
    course(where: { price: { _is_null: true } }) {
      id
      type
      level
      go1Integration
      reaccreditation
    }
  }
`

const UPDATE_COURSE_PRICE_MUTATION = gql`
  mutation updateCoursePrice(
    $price: numeric!
    $priceCurrency: String!
    $includeVAT: Boolean!
  ) {
    update_course(
      where: { price: { _is_null: true } }
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
      GET_COURSE_PRICING_QUERY
    )
    const courses: CourseType = await hasuraClient.request(GET_COURSES_QUERY)

    if (
      coursePrices.course_pricing.length !== 0 &&
      courses.course.length !== 0
    ) {
      const coursesToUpdate: CourseToUpdate[] = []

      courses.course.forEach(course => {
        coursePrices.course_pricing.forEach(price => {
          if (
            course.type === price.type &&
            course.level === price.level &&
            course.reaccreditation === price.reaccreditation &&
            course.go1Integration === price.blended
          ) {
            const course: CourseToUpdate = {
              price: price.priceAmount,
              includeVAT: true,
              priceCurrency: price.priceCurrency,
            }
            coursesToUpdate.push(course)
          }
        })
      })

      try {
        await Promise.all(
          coursesToUpdate.map((course: CourseToUpdate) => {
            const variables = {
              price: course.price,
              priceCurrency: course.priceCurrency,
              includeVAT: course.includeVAT,
            }

            hasuraClient.request(UPDATE_COURSE_PRICE_MUTATION, variables)
          })
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
