import { expect, test } from '../fixtures/delivery.fixture'
import { SERVICE_URL } from '../../config/env-data'
import { faker } from '@faker-js/faker/locale/ar'


//Объявляем таблицу параметров(могут быть любыми)
[
  { username: 'Daniil', phone: '+3716782992' },
  { username: 'Bob', phone: '+3716782993' },
  { username: 'Charlie', phone: '+3716782994' },
//В параметрах forEach говорим, с какими столбцами таблицы хотим работать в тесте
].forEach(({ username, phone }) => {
  //можем уже в описании теста использовать данные из таблицы
  test(`Create order through UI with fixture with ${username} ${phone}`, async ({ context, auth }) => {
    const page = await context.newPage()
    await context.addInitScript((token) => {
      localStorage.setItem('jwt', token)
    }, auth)
    await page.goto(SERVICE_URL)
    //Используем в данные из таблицы тестов
    await page.getByTestId('username-input').fill(username)
    await page.getByTestId('phone-input').fill(phone)
    await page.getByTestId('createOrder-button').click()
    await expect(page.getByTestId('orderSuccessfullyCreated-popup-ok-button')).toBeVisible()
  })
});

test('create order through UI with fixture', async ({ context, auth }) => {
  const page = await context.newPage()
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, auth)
  await page.goto(SERVICE_URL)
  await page.getByTestId('username-input').fill(faker.internet.username())
  await page.getByTestId('phone-input').fill(faker.phone.number())
  await page.getByTestId('createOrder-button').click()
  await expect(page.getByTestId('orderSuccessfullyCreated-popup-ok-button')).toBeVisible()
})

test('search for an existing order created through API with fixture', async ({ context, auth, orderId, }) => {
  // Set JWT in localStorage
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token)
  }, auth)

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
