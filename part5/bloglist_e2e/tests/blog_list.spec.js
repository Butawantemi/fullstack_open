const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'tester',
        name: 'Super Tester',
        password: 'Mwanza@2027'
      }
    })

    await request.post('/api/users', {
      data: {
        username: 'hacker',
        name: 'Super hacker',
        password: 'Mwanza@2027'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to the application')
    const username = page.getByTestId('username')
    const password = page.getByTestId('password')
    const button = page.getByRole('button', { name: 'login' })

    await expect(locator).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(button).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()
      const locator = page.getByRole('button', { name: 'logout' })
      await expect(locator).toBeVisible()
      await expect(page.getByText('Welcome back, Super Tester')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('root')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('First Blog Post')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByText('A new blog "First Blog Post" by Japhet Paul was successfully added!')).toBeVisible()
      await expect(page.getByText('First Blog Post Japhet Paul')).toBeVisible()
    })
  })

  describe('When logged in to like', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('First Blog Post')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('click like button increase likes', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('toggleContent')).toContainText('likes 1')
    })
  })

  describe('When logged in to delete', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('First Blog Post')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('Authorized user can delete blog', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await expect(page.getByText('First Blog Post Japhet Paul')).toBeVisible()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByTestId('blog')).toBeEmpty()
    })
  })

  describe('delete only blog your created', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('First Blog Post')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()


      await page.getByTestId('username').fill('hacker')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('check remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      const remove = await page.getByRole('button', { name: 'remove' })
      await expect(remove).not.toBeVisible()
    })
  })

  describe('check if blogs sorted by number of likes', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('tester')
      await page.getByTestId('password').fill('Mwanza@2027')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('Highest likes')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Highest likes Japhet Paul')).toBeVisible()

      await page.getByTestId('title').fill('Lowest likes')
      await page.getByTestId('author').fill('Japhet Paul')
      await page.getByTestId('url').fill('https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Lowest likes Japhet Paul')).toBeVisible()

      const lastBlog = page.getByTestId('blog').last()
      await lastBlog.getByTestId('hide-view').click()
      await lastBlog.getByRole('button', { name: 'like' }).click()
      await lastBlog.getByRole('button', { name: 'like' }).click()
      await lastBlog.getByRole('button', { name: 'like' }).click()
      await lastBlog.getByTestId('hide-view').click()
      await expect(page.getByText('Lowest likes Japhet Paul')).toBeVisible()
    })

    test('sort', async ({ page }) => {
      await expect(page.getByTestId('blog').first()).toContainText('Lowest likes')
    })
  })

})