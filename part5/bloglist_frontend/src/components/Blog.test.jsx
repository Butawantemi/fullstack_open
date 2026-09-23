import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('render content', () => {

  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com'
  }

  const user = {
    username: 'Super Tester'
  }

  render(<Blog blog={blog} user={user} />)

  const div = screen.getByTestId('toggleContent')
  const styles = window.getComputedStyle(div)

  const elementTitle = screen.getByText('First blog post!')
  const elementAuthor = screen.getByText('Japhet Paul')

  expect(styles.display).toBe('none')
  expect(elementTitle).toBeDefined()
  expect(elementAuthor).toBeDefined()
})

test('when button clicked', async() => {

  const user = userEvent.setup()
  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com'
  }

  const user1 = {
    username: 'Super Tester'
  }

  render(<Blog blog={blog} user={user1} />)

  const button = screen.getByText('view')
  await user.click(button)

  const div = screen.getByTestId('toggleContent')
  const styles = window.getComputedStyle(div)
  expect(styles.display).toBe('block')

})

test('like button clicked twice', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com'
  }

  const user1 = {
    username: 'Super Tester'
  }

  render(<Blog blog={blog} user={user1} handleUpdateLike={mockHandler}/>)

  const button = screen.getByText('like')

  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})

