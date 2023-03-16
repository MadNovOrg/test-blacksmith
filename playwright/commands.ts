import { Page } from '@playwright/test'

export function waitForGraphQLRequest(
  page: Page,
  valueToFind: string
): Promise<boolean> {
  return page
    .waitForRequest(request => {
      if (
        request.url().includes('v1/graphql') &&
        request.postData() &&
        request.postData()?.includes(valueToFind)
      ) {
        return true
      }
      return false
    })
    .then(() => true)
    .catch(() => false)
}

export async function waitForGraphQLResponse(
  page: Page,
  valueToFind: string
): Promise<boolean> {
  const response = await page.waitForResponse(response => {
    if (response.url().includes('v1/graphql')) {
      const contentType = response.headers()['content-type']
      return contentType.includes('application/json')
    }
    return false
  })
  const jsonResponse = await response.json()
  if (!JSON.stringify(jsonResponse.data).includes(valueToFind)) {
    return false
  }
  return true
}
