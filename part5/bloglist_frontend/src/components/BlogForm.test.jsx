import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('</BlogForm> ', async () => {
  const user = userEvent.setup()
  const submitMock = vi.fn()

  render(<BlogForm createBlog={submitMock}
  />)

  const title =  screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const createBlog = screen.getByText('create')

  await user.type(title, 'First Blog Post')
  await user.type(author, 'Paul Alx')
  await user.type(url, 'https://tanzania-Kwanza.co.tz')
  await user.click(createBlog)


  expect(submitMock.mock.calls[0][0].title).toBe('First Blog Post')
})