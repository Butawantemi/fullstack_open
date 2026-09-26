const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
    const username = page.getByTestId('username')
    const password = page.getByTestId('password')
    const button = page.getByRole('button', { name: 'login' })

    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(button).toBeVisible()
  })

  describe('Login', () => {
    test('Login succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByText('Welcome back, Super Tester')).toBeVisible()
    })


    test('Login fails if username/password is incorrect', async ({ page }) => {
      await loginWith(page, 'tester', 'wrongpassword')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'First Blog Post', 'Japhet Paul', 'https://japhetbuta.com')
      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByText('First Blog Post')).toBeVisible()
    })
  })

  describe('When logged in to like', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')

      await createBlog(page, 'First Blog Post', 'Japhet Paul', 'https://japhetbuta.com/blogs')
    })

    test('click like button increase likes', async ({ page }) => {
      await page.getByRole('link', { name: 'https://japhetbuta.com' }).click()

      await page.waitForURL('**/notes/**')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('toggleContent')).toContainText('likes 1')
    })
  })

  describe('When logged in to delete', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')

      await createBlog(page, 'First Blog Post', 'Japhet Paul', 'https://japhetbuta.com/blogs')

      await expect(page.getByText('First Blog Post Japhet Paul')).toBeVisible()
    })

    test('Authorized user can delete blog', async ({ page }) => {
      await page.getByRole('link', { name: 'https://japhetbuta.com' }).click()
      await page.waitForURL('**/notes/**')

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByText('First Blog Post')).not.toBeVisible()
    })
  })

  describe('delete only blog your created', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')
      await createBlog(page, 'First Blog Post', 'Japhet Paul', 'https://japhetbuta.com/blogs')
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'hacker', 'Mwanza@2027')
    })

    test('check remove button is not visible to non-creators inside details view', async ({ page }) => {
      await page.getByRole('link', { name: 'https://japhetbuta.com/blogs' }).click()
      await page.waitForURL('**/notes/**')
      const remove = page.getByRole('button', { name: 'remove' })
      await expect(remove).not.toBeVisible()
    })
  })
  describe('check if blogs sorted by number of likes', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'Mwanza@2027')

      await createBlog(page, 'Highest likes', 'Japhet Paul', 'https://japhetbuta.com/blogs')

      await expect(page.getByText('Highest likes Japhet Paul')).toBeVisible()

      await createBlog(page, 'Lowest likes', 'Japhet Paul', 'https://japhetbuta.com/blogs')

      await expect(page.getByText('Lowest likes Japhet Paul')).toBeVisible()

      const lastBlog = page.getByTestId('blog').last()
      await lastBlog.getByRole('button', { name: 'like' }).click()
      await expect(lastBlog).toContainText('likes 1')

      await lastBlog.getByRole('button', { name: 'like' }).click()
      await expect(lastBlog).toContainText('likes 2')

      await lastBlog.getByRole('button', { name: 'like' }).click()
      await expect(lastBlog).toContainText('likes 3')

      await expect(page.getByText('Lowest likes Japhet Paul')).toBeVisible()
    })

    test('sort', async ({ page }) => {
      await expect(page.getByTestId('blog').first()).toContainText('Lowest likes')
    })
  })

})