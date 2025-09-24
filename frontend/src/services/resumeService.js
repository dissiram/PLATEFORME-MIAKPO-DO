import axios from "axios";

const API_URL = "http://localhost:5000/api/resumes";

export const getResume = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createOrUpdateResume = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getPublicResume = async (userId) => {
  const res = await axios.get(`${API_URL}/public/${userId}`);
  return res.data;
};
