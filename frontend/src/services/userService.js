import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
