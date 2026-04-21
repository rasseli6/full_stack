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

  test('kirjautumislomake näkyy oletuksena', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  describe('Kirjautuminen', () => {
    test('onnistuu oikeilla tunnuksilla', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('salainenteppo122333')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Teemu pommitestimies logged in')).toBeVisible()
    })

    test('epäonnistuu väärillä tunnuksilla', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('väärä')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('Kirjautuneena', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('teppo1')
      await page.getByRole('textbox').last().fill('salainenteppo122333')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('uuden blogin voi luoda', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Playwrightin ihmeellinen maailma')
      await page.getByLabel('author:').fill('Teemu pommitestimies')
      await page.getByLabel('url:').fill('playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Playwrightin ihmeellinen maailma').last()).toBeVisible()
    })

    test('blogia voi likettää', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Likitettävä blogi')
      await page.getByLabel('author:').fill('Teemu pommitestimies')
      await page.getByLabel('url:').fill('playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('link', { name: /Likitettävä blogi/ }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('blogin lisännyt käyttäjä voi poistaa blogin', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Poistettava blogi')
      await page.getByLabel('author:').fill('Teemu pommitestimies')
      await page.getByLabel('url:').fill('poistettava.fi')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('link', { name: /Poistettava blogi/ }).click()
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Poistettava blogi')).not.toBeVisible()
    })

    test('vain blogin lisännyt käyttäjä näkee poistonapin', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Toinen Käyttäjä',
          username: 'toinen1',
          password: 'toinen123'
        }
      })
      await page.getByRole('link', { name: 'new blog' }).click()
      await page.getByLabel('title:').fill('Vain omistajan blogi')
      await page.getByLabel('author:').fill('Teemu pommitestimies')
      await page.getByLabel('url:').fill('omistaja.fi')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('toinen1')
      await page.getByRole('textbox').last().fill('toinen123')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('link', { name: /Vain omistajan blogi/ }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})