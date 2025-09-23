import { Page } from '@playwright/test'

export function waitForGraphQLRequest(
  page: Page,
  operationName: string,
): Promise<boolean> {
  return page
    .waitForRequest(request => {
      if (
        request.url().includes('/graphql') &&
        request.postDataJSON() &&
        request.postDataJSON().operationName.includes(operationName)
      ) {
        return true
      }
      return false
    })
    .then(() => true)
    .catch(() => false)
}

/* This function parses the graphQL response, it works using the following structure:
  { 
    "data": {
      "<keyToFind>": {
        "<valueToFind>"
      }
    }
  }
*/
export async function waitForGraphQLResponse(
  page: Page,
  keyToFind: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ [key: string]: any }> {
  const response = await page.waitForResponse(async response => {
    return (
      response.url().includes('/graphql') &&
      response.status() === 200 &&
      (await response.text()).includes(keyToFind)
    )
  })

  const responseBody = await response.text()
  const { data } = JSON.parse(responseBody ?? '{}')
  if (JSON.stringify(data[keyToFind])) {
    return data
  }
  return {}
}
