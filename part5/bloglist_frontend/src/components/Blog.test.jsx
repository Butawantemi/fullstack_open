import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Blog from './Blog'

test('Blog information and likes are shown to unauthenticated users, buttons are hidden', () => {

  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com',
    likes: 12,
    user: { username: 'tester', id: 'tester123' }
  }

  render(<BrowserRouter><Blog blog={blog} user={null} /></BrowserRouter>)

  expect(screen.getByText(/First blog post!/)).toBeDefined()
  expect(screen.getByText(/Japhet Paul/)).toBeDefined()
  expect(screen.getByText(/likes 12/)).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('Authenticated non-creators see only the like button', async() => {
  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com',
    likes: 12,
    user: { username: 'tester', id: 'tester123' }
  }

  const user = {
    username: 'Super Tester',
    id: 'tester1234'
  }

  render(<BrowserRouter><Blog blog={blog} user={user} /></BrowserRouter>)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('The blog creator is shown both the like and delete buttons', async() => {
  const blog = {
    title: 'First blog post!',
    author: 'Japhet Paul',
    url: 'https://japhetbuta.com',
    likes: 12,
    user: { username: 'Super Tester', id: 'tester123' }
  }

  const user = {
    username: 'Super Tester',
    id: 'tester123'
  }

  render(<BrowserRouter><Blog blog={blog} user={user} /></BrowserRouter>)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeDefined()
})

