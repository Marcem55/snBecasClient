import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, { dni: credentials });
  return response.data;
};

export default { login };
