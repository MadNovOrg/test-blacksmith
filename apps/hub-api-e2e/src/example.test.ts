import { test, expect } from '@playwright/test'

test('is up & running', async ({ request }) => {
  // Act
  const res = await request.get('/')

  // Assert
  expect(res.ok()).toBeTruthy()
})

test('is returning welcome message', async ({ request }) => {
  // Act
  const res = await request.get('/')

  // Assert
  expect(res.ok()).toBeTruthy()
})
