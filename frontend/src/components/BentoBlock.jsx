// src/components/portfolio/BentoBlock.jsx
import React, { useState, useRef } from "react";
import { PencilIcon, TrashIcon, ArrowUturnRightIcon, PaintBrushIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const colors = ["bg-white", "bg-gray-100", "bg-blue-100", "bg-yellow-100", "bg-green-100", "bg-pink-100", "bg-purple-100"];
const sizes = ["small", "medium", "large"];

const BentoBlock = ({ block, index, onUpdate, onDelete, onUploadImage, onUploadVideo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const fileInputRef = useRef(null);

  const toggleEditing = () => setIsEditing(!isEditing);
  const handleChange = (field, value) => onUpdate(index, { ...block, [field]: value });
  const handleSizeChange = () => handleChange("size", sizes[(sizes.indexOf(block.size) + 1) % sizes.length] || "medium");
  const handleColorChange = () => handleChange("bgColor", colors[(colors.indexOf(block.bgColor) + 1) % colors.length] || "bg-white");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (block.type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => onUploadImage(index, reader.result);
      reader.readAsDataURL(file);
    } else if (block.type === "video") {
      const url = URL.createObjectURL(file);
      onUploadVideo(index, url);
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case "text":
        return isEditing ? (
          <textarea value={block.content} onChange={(e) => handleChange("content", e.target.value)} placeholder="Écrivez du texte..." className="w-full p-2 border rounded"/>
        ) : <p>{block.content || "Écrivez du texte..."}</p>;
      case "image":
        return block.content ? <img src={block.content} className="w-full h-48 object-cover rounded"/> :
          <div className="flex flex-col items-center justify-center text-gray-400 h-48 cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <PhotoIcon className="w-10 h-10 mb-1"/> Ajouter une image
          </div>;
      case "video":
        return block.content ? <video src={block.content} controls className="w-full h-48 rounded"/> :
          <div className="flex flex-col items-center justify-center text-gray-400 h-48 cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <VideoCameraIcon className="w-10 h-10 mb-1"/> Ajouter une vidéo
          </div>;
      default:
        return <p>{block.content}</p>;
    }
  };

  return (
    <motion.div layout className={`${block.bgColor} rounded-2xl p-4 relative shadow-md hover:shadow-xl cursor-pointer`} onMouseEnter={() => setShowToolbar(true)} onMouseLeave={() => setShowToolbar(false)}>
      <AnimatePresence>
        {showToolbar && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded p-1 shadow">
            <button onClick={toggleEditing}><PencilIcon className="w-5 h-5"/></button>
            <button onClick={handleSizeChange}><ArrowUturnRightIcon className="w-5 h-5"/></button>
            <button onClick={handleColorChange}><PaintBrushIcon className="w-5 h-5"/></button>
            <button onClick={() => onDelete(index)}><TrashIcon className="w-5 h-5 text-red-600"/></button>
          </motion.div>
        )}
      </AnimatePresence>
      {(block.type === "image" || block.type === "video") && <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload}/>}
      {renderContent()}
    </motion.div>
  );
};

export default BentoBlock;
