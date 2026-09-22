import axios from 'axios'
const baseUrl = '/api/blogs'

const getAllBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const createblog = async (newBlog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const updateblog = async (updateblog, id) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.put(`${baseUrl}/${id}`, updateblog, config)
  return response.data
}

const deleteBlog = async(id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}
export default { setToken, createblog, updateblog, getAllBlogs, deleteBlog }
