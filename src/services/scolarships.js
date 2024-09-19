import axios from "axios";
const baseUrl = "http://localhost:3001/api/scolarships";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.get(baseUrl, config);

  return response.data;
};

const create = async (newScolarship) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.post(baseUrl, newScolarship, config);
  return response.data;
};

const changeStatus = async (scolarshipId, status) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.put(
    `${baseUrl}/status/${scolarshipId}`,
    { status },
    config
  );
  return response.data;
};

const addComment = async (scolarshipId, newComment) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.put(
    `${baseUrl}/comments/${scolarshipId}`,
    { comment: newComment },
    config
  );

  return response.data;
};

const deleteScolarship = async (id) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  create,
  changeStatus,
  addComment,
  deleteScolarship,
  setToken,
};
