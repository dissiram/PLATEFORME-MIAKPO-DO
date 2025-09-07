import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  PencilIcon,
  LinkIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PaintBrushIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Types de blocs
const blockTypes = [
  { type: "text", icon: DocumentTextIcon, label: "Texte" },
  { type: "image", icon: PhotoIcon, label: "Image" },
  { type: "video", icon: VideoCameraIcon, label: "Vidéo" },
  { type: "link", icon: LinkIcon, label: "Lien" },
  { type: "title", icon: PencilIcon, label: "Titre" },
];

const colors = ["bg-white", "bg-gray-100", "bg-blue-100", "bg-yellow-100", "bg-green-100", "bg-pink-100", "bg-purple-100"];
const sizes = ["small", "medium", "large"];

// ------------------- Composant BentoBlock -------------------
const BentoBlock = ({ block, index, onUpdate, onDelete, onUploadImage, onUploadVideo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const fileInputRef = useRef(null);

  const toggleEditing = () => setIsEditing(!isEditing);
  const handleChange = (field, value) => onUpdate(index, { ...block, [field]: value });
  const handleSizeChange = () => handleChange("size", sizes[(sizes.indexOf(block.size) + 1) % sizes.length]);
  const handleColorChange = () => handleChange("bgColor", colors[(colors.indexOf(block.bgColor) + 1) % colors.length]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (block.type === "image") onUploadImage(index, file);
    else if (block.type === "video") onUploadVideo(index, file);
  };

  const renderContent = () => {
    switch (block.type) {
      case "text":
        return isEditing ? (
          <textarea
            value={block.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Écrivez du texte..."
            className="w-full p-2 border rounded"
          />
        ) : (
          <p>{block.content || "Écrivez du texte..."}</p>
        );
      case "image":
        return block.content ? (
          <img src={block.content} alt="" className="w-full h-48 object-cover rounded" />
        ) : (
          <div
            className="flex flex-col items-center justify-center text-gray-400 h-48 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <PhotoIcon className="w-10 h-10 mb-1" /> Ajouter une image
          </div>
        );
      case "video":
        return block.content ? (
          <video src={block.content} controls className="w-full h-48 rounded" />
        ) : (
          <div
            className="flex flex-col items-center justify-center text-gray-400 h-48 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <VideoCameraIcon className="w-10 h-10 mb-1" /> Ajouter une vidéo
          </div>
        );
      case "link":
        return isEditing ? (
          <input
            type="url"
            value={block.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="https://..."
            className="w-full p-2 border rounded"
          />
        ) : block.content ? (
          <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {block.content}
          </a>
        ) : (
          <p className="text-gray-400">Aucun lien</p>
        );
      case "title":
        return isEditing ? (
          <input
            type="text"
            value={block.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Titre de section"
            className="w-full text-xl font-bold border-b focus:outline-none"
          />
        ) : (
          <h2 className="text-2xl font-bold">{block.content || "Titre"}</h2>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      className={`${block.bgColor} rounded-2xl p-4 relative shadow-md hover:shadow-xl cursor-pointer`}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded p-1 shadow"
          >
            <button onClick={toggleEditing} title="Modifier">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={handleSizeChange} title="Changer taille">
              <ArrowUturnRightIcon className="w-5 h-5" />
            </button>
            <button onClick={handleColorChange} title="Changer couleur">
              <PaintBrushIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(index)} title="Supprimer">
              <TrashIcon className="w-5 h-5 text-red-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {(block.type === "image" || block.type === "video") && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept={block.type === "image" ? "image/*" : "video/*"}
        />
      )}

      {renderContent()}
    </motion.div>
  );
};

// ------------------- Composant principal Portfolio -------------------
const BentoPortfolio = () => {
  const [blocks, setBlocks] = useState([]);
  const [profile, setProfile] = useState({ name: "", bio: "", image: "" });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const profileFileInputRef = useRef();

  // ------------------- Historique -------------------
  const pushHistory = useCallback(
    (newBlocks) => {
      const newHist = history.slice(0, historyIndex + 1);
      newHist.push(newBlocks);
      if (newHist.length > 20) newHist.shift();
      setHistory(newHist);
      setHistoryIndex(newHist.length - 1);
    },
    [history, historyIndex]
  );

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  // ------------------- Gestion des blocs -------------------
  const addBlock = (type) => {
    const newBlock = { type, content: "", size: "medium", bgColor: "bg-white" };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    pushHistory(newBlocks);
  };
  const updateBlock = (i, b) => {
    const newBlocks = [...blocks];
    newBlocks[i] = b;
    setBlocks(newBlocks);
    pushHistory(newBlocks);
  };
  const deleteBlock = (i) => {
    const newBlocks = blocks.filter((_, idx) => idx !== i);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
  };

  // ------------------- Fonction générique d'upload -------------------
  const uploadFile = async (file, endpoint) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/uploads/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur upload");
      }
      const data = await res.json();
      return `http://localhost:5000/uploads/${data.filename}`;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Erreur upload : " + err.message);
      return null;
    }
  };

  // ------------------- Upload image de profil -------------------
  const handleUploadProfileImage = async (e) => {
    const file = e.target.files[0];
    const uploadedUrl = await uploadFile(file, "profile");
    if (uploadedUrl) setProfile({ ...profile, image: uploadedUrl });
  };

  // ------------------- Upload image d'un bloc -------------------
  const handleUploadImage = async (i, file) => {
    const uploadedUrl = await uploadFile(file, "block");
    if (uploadedUrl) updateBlock(i, { ...blocks[i], content: uploadedUrl });
  };

  // ------------------- Upload vidéo (local) -------------------
  const handleUploadVideo = (i, file) => {
    const url = URL.createObjectURL(file);
    updateBlock(i, { ...blocks[i], content: url });
  };

  // ------------------- Charger portfolio existant -------------------
  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/portfolios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setBlocks(data.blocks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPortfolio();
  }, []);

  // ------------------- Sauvegarde -------------------
  const saveToDB = async () => {
    try {
      setSaving(true);
      setSaved(false);
      const payload = { title: "Mon portfolio", profile, blocks, public: false };
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const gridCols = { small: "col-span-1", medium: "col-span-2", large: "col-span-3" };

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Profil */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {profile.image ? (
            <img src={profile.image} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-lg" />
          ) : (
            <UserCircleIcon className="w-28 h-28 text-gray-400" />
          )}
          <button
            onClick={() => profileFileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-600 transition"
            title="Changer la photo"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
          </button>
          <input type="file" accept="image/*" ref={profileFileInputRef} onChange={handleUploadProfileImage} className="hidden" />
        </div>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Votre nom"
          className="text-3xl font-bold border-b text-center focus:outline-none"
        />
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Courte bio..."
          className="text-gray-600 mt-1 w-full text-center border rounded p-2 focus:outline-none"
        />
      </div>

      {/* Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blocks.map((block, i) => (
          <div key={i} className={gridCols[block.size] || "col-span-2"}>
            <BentoBlock
              block={block}
              index={i}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onUploadImage={handleUploadImage}
              onUploadVideo={handleUploadVideo}
            />
          </div>
        ))}
      </div>

      {/* Ajouter blocs */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 flex gap-3 bg-white p-3 rounded-xl shadow-lg z-50">
        {blockTypes.map((b) => (
          <button
            key={b.type}
            onClick={() => addBlock(b.type)}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            title={b.label}
          >
            <b.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Sauvegarder */}
      <button
        onClick={saveToDB}
        disabled={saving}
        className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 ${
          saving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white transition`}
      >
        {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder"}
        <CloudArrowUpIcon className="w-5 h-5" />
      </button>

      {/* Undo / Redo */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={undo} disabled={historyIndex <= 0} className="p-2 bg-gray-200 rounded disabled:opacity-50">
          <ArrowUturnLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ArrowUturnRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BentoPortfolio;
