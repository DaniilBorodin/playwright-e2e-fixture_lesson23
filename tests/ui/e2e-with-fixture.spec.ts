import { expect, test } from '../fixtures/delivery.fixture'
import { SERVICE_URL } from '../../config/env-data'
import { faker } from '@faker-js/faker/locale/ar'

test('create order through UI with fixture', async ({ context, auth }) => {
  const page = await context.newPage()

  // Set JWT in localStorage
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, auth.jwt)

  await page.goto(SERVICE_URL)
  await page.getByTestId('username-input').fill(faker.internet.username())
  await page.getByTestId('phone-input').fill(faker.phone.number())
  await page.getByTestId('createOrder-button').click()
  await expect(page.getByTestId('orderSuccessfullyCreated-popup-ok-button')).toBeVisible()
})

test('search for an existing order created through API with fixture', async ({
  context,
  auth,
  orderId,
}) => {
  // Set JWT in localStorage
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, auth.jwt)

  // Search for the created order through the UI
  const page = await context.newPage()
  await page.goto(SERVICE_URL)
  await page.getByTestId('openStatusPopup-button').click()
  await page.getByTestId('searchOrder-input').fill(String(orderId))
  await page.getByTestId('searchOrder-submitButton').click()
  await expect(page.getByText('OPEN')).toBeVisible()
})

test('search for order with delivered status using mock fixture', async ({ mainPage }) => {
  await mainPage.getByTestId('openStatusPopup-button').click()
  await mainPage.getByTestId('searchOrder-input').fill('9999')
  await mainPage.getByTestId('searchOrder-submitButton').click()
  await expect(mainPage.getByText('DELIVERED', { exact: true })).toBeVisible()
})
