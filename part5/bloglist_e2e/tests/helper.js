const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.waitForURL('**/login**')

  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.waitForURL('**/create**')

  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = { loginWith, createBlog }