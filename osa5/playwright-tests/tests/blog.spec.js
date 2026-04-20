const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blogilista', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Teemu pommitestimies',
        username: 'teppo1',
        password: 'salainenteppo122333'
      }
    })
    await page.goto('/')
  })

  test('toivottavasti kirjatumislomake näkyy oletuksena', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Kirjautuminen', () => {
    test('onnistuu oikeilla tunnuksilla', async ({ page }) => {
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('salainenteppo122333')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Teemu pommitestimies logged in')).toBeVisible()
    })

    test('epäonnistuu väärillä tunnuksilla', async ({ page }) => {
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('väärä')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('Kirjautuneena', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('salainenteppo122333')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('uuden blogin voi luoda', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('Playwrightin ihmeellinen maailma')
      await page.getByLabel('author:').fill('Teppo Testaaja')
      await page.getByLabel('url:').fill('playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Playwrightin ihmeellinen maailma')).toBeVisible()
    })
      test('blogia voi likettää', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByLabel('title:').fill('Likitettävä blogi')
    await page.getByLabel('author:').fill('Teppo Testaaja')
    await page.getByLabel('url:').fill('playwright.dev')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('0')).toBeVisible()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('1')).toBeVisible()
    })
  })
})