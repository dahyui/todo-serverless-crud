import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_HTTP_BASE_URL,
  // auth: {
  //   username: process.env.REACT_APP_HTTP_BASIC_USER || '',
  //   password: process.env.REACT_APP_HTTP_BASIC_PASS || ''
  // }
});
