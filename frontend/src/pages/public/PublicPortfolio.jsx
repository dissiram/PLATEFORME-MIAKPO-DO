// src/pages/public/PublicPortfolio.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const gridCols = { small: "col-span-1", medium: "col-span-2", large: "col-span-3" };

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolios/${userId}`);
        if (res.data) {
          setProfile(res.data.profile);
          setBlocks(res.data.blocks);
        }
      } catch (err) {
        console.error("Erreur récupération portfolio public:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId]);

  if (loading) return <div>Chargement du portfolio...</div>;
  if (!profile.name) return <div>Portfolio introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        {profile.image ? (
          <img src={profile.image} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-lg"/>
        ) : (
          <UserCircleIcon className="w-28 h-28 text-gray-400"/>
        )}
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-gray-600 text-center">{profile.bio}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blocks.map((b, i) => (
          <div 
            key={i} 
            className={`${b.bgColor} p-4 rounded-2xl shadow-md ${gridCols[b.size] || "col-span-2"}`}
          >
            {b.type === "text" && <p className="text-gray-800 whitespace-pre-wrap">{b.content}</p>}
            {b.type === "title" && <h2 className="text-2xl font-bold">{b.content}</h2>}
            {b.type === "image" && <img src={b.content} className="w-full h-48 object-cover rounded-lg"/>}
            {b.type === "video" && <video src={b.content} controls className="w-full h-48 rounded-lg"/>}
            {b.type === "link" && <a href={b.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{b.content}</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicPortfolio;
