import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../services/portfolioService";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);

  // Charger depuis API au montage
  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    const data = await getPortfolios();
    setPortfolios(data);
  };

  const addPortfolio = async (portfolio) => {
    const newPortfolio = await createPortfolio(portfolio);
    setPortfolios((prev) => [...prev, newPortfolio]);
  };

  const editPortfolio = async (id, updatedData) => {
    const updated = await updatePortfolio(id, updatedData);
    setPortfolios((prev) =>
      prev.map((item) => (item._id === id ? updated : item))
    );
  };

  const removePortfolio = async (id) => {
    await deletePortfolio(id);
    setPortfolios((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{ portfolios, addPortfolio, editPortfolio, removePortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolios = () => useContext(PortfolioContext);
