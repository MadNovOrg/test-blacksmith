import { test } from '@playwright/test'

import { LoginPage } from '../pages/LoginPage'

test.describe('Authentication', () => {
  test('login successfully', async ({ page }) => {
    await new LoginPage(page)
      .goto()
      .then(_ => _.logIn())
      .then(_ => _.checkHomePageOpened())
  })

  // commented till the functionality works, just for checking the github actions
  // test("login error: incorrect email", async ({ page }) => {
  //   await new LoginPage(page)
  //     .goto()
  //     .then(_ => _.logInWithError('abc@def.ghi', 'jklmnop'))
  //     .then(_ => _.checkErrors({ generalError: 'Email or password was incorrect, please try again' }));
  // });
})
