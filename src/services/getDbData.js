import axios from "axios";

export const getSchools = async () => {
  try {
    const schools = await axios.get("http://localhost:3001/api/schools");

    return schools.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTowns = async () => {
  try {
    const towns = await axios.get("http://localhost:3001/api/towns");
    return towns.data;
  } catch (error) {
    console.error(error);
  }
};

export const getNeigborhoods = async () => {
  try {
    const neigborhoods = await axios.get(
      "http://localhost:3001/api/neigborhoods"
    );
    return neigborhoods.data;
  } catch (error) {
    console.error(error);
  }
};

export const getClubs = async () => {
  try {
    const clubs = await axios.get("http://localhost:3001/api/clubs");
    return clubs.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSports = async () => {
  try {
    const sports = await axios.get("http://localhost:3001/api/sports");
    return sports.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCategories = async () => {
  try {
    const categories = await axios.get("http://localhost:3001/api/categories");
    return categories.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async () => {
  try {
    const users = await axios.get("http://localhost:3001/api/users");
    return users.data;
  } catch (error) {
    console.error(error);
  }
};
