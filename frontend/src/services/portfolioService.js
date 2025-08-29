import axios from "axios";

const API_URL = "http://localhost:5000/api/portfolios"; // adapte selon ton backend

// Récupérer tous les portfolios
export const getPortfolios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Créer un nouveau portfolio
export const createPortfolio = async (portfolio) => {
  const res = await axios.post(API_URL, portfolio);
  return res.data;
};

// Mettre à jour un portfolio
export const updatePortfolio = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
};

// Supprimer un portfolio
export const deletePortfolio = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
