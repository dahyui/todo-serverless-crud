import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_HTTP_BASE_URL,
});
