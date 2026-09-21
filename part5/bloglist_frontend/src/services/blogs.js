import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const createblog = async (newBlog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

export default { setToken, createblog };
