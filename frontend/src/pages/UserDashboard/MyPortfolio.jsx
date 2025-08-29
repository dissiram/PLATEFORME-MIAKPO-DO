// src/pages/UserDashboard/MyPortfolio.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const gridCols = { small: "col-span-1", medium: "col-span-2", large: "col-span-3" };

const MyPortfolio = () => {
  const [profile, setProfile] = useState({});
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/portfolios/me", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (res.data) {
          setProfile(res.data.profile);
          setBlocks(res.data.blocks);
        }
      } catch (err) {
        console.error("Erreur récupération portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Profil centré */}
      <div className="flex flex-col items-center gap-4">
        {profile.image ? (
          <img src={profile.image} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-lg"/>
        ) : (
          <UserCircleIcon className="w-28 h-28 text-gray-400"/>
        )}
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-gray-600 text-center">{profile.bio}</p>
      </div>

      {/* Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blocks.map((b, i) => (
          <div 
            key={i} 
            className={`${b.bgColor} p-4 rounded-2xl shadow-md hover:shadow-xl transition ${gridCols[b.size] || "col-span-2"}`}
          >
            {b.type === "text" && <p className="text-gray-800 whitespace-pre-wrap">{b.content}</p>}
            {b.type === "title" && <h2 className="text-2xl font-bold">{b.content}</h2>}
            {b.type === "image" && <img src={b.content} className="w-full h-48 object-cover rounded-lg"/>}
            {b.type === "video" && <video src={b.content} controls className="w-full h-48 rounded-lg"/>}
            {b.type === "link" && <a href={b.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{b.content}</a>}
          </div>
        ))}
      </div>

      {/* Bouton Modifier */}
      <button 
        onClick={() => navigate("/dashboard/user/portfolio")} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Modifier
      </button>
    </div>
  );
};

export default MyPortfolio;
