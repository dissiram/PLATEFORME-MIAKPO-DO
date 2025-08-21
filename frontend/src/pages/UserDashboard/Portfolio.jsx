import React, { useRef, useState } from "react";
import { CameraIcon, PlusIcon as ImagePlus, DocumentTextIcon as TextIcon, VideoCameraIcon as VideoIcon, LinkIcon as LinkIco, PencilSquareIcon as TitleIco, TrashIcon } from '@heroicons/react/24/outline';
import { Resizable } from "react-resizable";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import "react-resizable/css/styles.css";

// Composant pour les tooltips animés
function TooltipButton({ children, tooltip, onClick, disabled = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <button
        className={`p-3 rounded-full transition ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={disabled}
      >
        {children}
      </button>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bloc sortable
function SortableBlock({ block, handleContentChange, handleRemove, handleBgChange, handleResize }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined, transition };

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      className={`relative group rounded-2xl overflow-hidden border border-gray-200 p-2 bg-white ${isDragging ? 'opacity-50 z-50' : 'opacity-100'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {block.type === "title" ? (
        // Bloc titre : toujours pleine largeur
        <div className="w-full">
          <input
            type="text"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
            className="w-full text-center font-bold text-2xl outline-none p-4 rounded-lg transition-colors"
            style={{ backgroundColor: block.bgColor || "#ffffff" }}
            placeholder="Titre de section"
          />
        </div>
      ) : (
        // Les autres blocs : redimensionnables
        <Resizable
          width={block.width}
          height={block.height}
          minConstraints={[150, 100]}
          maxConstraints={[800, 600]}
          resizeHandles={['se']}
          onResize={(e, { size }) => {
            // Mise à jour visuelle en temps réel pendant le redimensionnement
            e.preventDefault();
          }}
          onResizeStop={(e, { size }) => handleResize(block.id, size.width, size.height)}
        >
          <div className="w-full h-full" style={{ width: block.width + 'px', height: block.height + 'px' }}>
            {block.type === "image" && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img src={block.content} alt="Bloc" className="w-full h-full object-cover" />
              </div>
            )}
            {block.type === "text" && (
              <textarea
                value={block.content}
                onChange={(e) => handleContentChange(block.id, e.target.value)}
                className="w-full h-full resize-none bg-white outline-none p-4 rounded-lg border border-gray-200 focus:border-blue-500 transition-colors"
                placeholder="Saisissez votre texte ici..."
              />
            )}
            {block.type === "video" && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                <video src={block.content} controls className="w-full h-full object-contain rounded-lg" />
              </div>
            )}
            {block.type === "link" && (
              <div className="w-full h-full flex flex-col items-center justify-center rounded-lg p-4 bg-gray-50 border border-gray-200">
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => handleContentChange(block.id, e.target.value, "content")}
                  placeholder="Texte du lien"
                  className="w-full text-center outline-none p-2 mb-2 border-b border-gray-300 focus:border-blue-500 bg-transparent transition-colors"
                />
                <input
                  type="text"
                  value={block.url}
                  onChange={(e) => handleContentChange(block.id, e.target.value, "url")}
                  placeholder="https://exemple.com"
                  className="w-full text-center outline-none p-2 border-b border-gray-300 focus:border-blue-500 bg-transparent transition-colors"
                />
              </div>
            )}
          </div>
        </Resizable>
      )}

      {/* Bouton delete pour tous les blocs */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove(block.id);
        }}
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        title="Supprimer le bloc"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {/* Sélecteur couleur uniquement pour le titre */}
      {block.type === "title" && (
        <input
          type="color"
          value={block.bgColor || "#ffffff"}
          onChange={(e) => handleBgChange(block.id, e.target.value)}
          className="absolute top-2 left-2 w-6 h-6 p-0 border-none cursor-pointer rounded-full overflow-hidden shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          title="Changer la couleur de fond"
        />
      )}
    </motion.div>
  );
}

export default function Portfolio() {
  const photoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [profile, setProfile] = useState({
    photo: null,
    name: "Votre nom",
    desc: "Ajoutez une description courte ici..."
  });
  
  const [blocks, setBlocks] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddBlock = (type, content) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: content || (type === "text" ? "" : type === "title" ? "Titre de section" : ""),
      bgColor: type === "title" ? "#ffffff" : undefined,
      url: type === "link" ? "" : undefined,
      width: type === "text" ? 300 : 400,
      height: type === "text" ? 150 : 250,
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleRemoveBlock = (id) => {
    setBlocks(bs => bs.filter(b => b.id !== id));
  };
  
  const handleContentChange = (id, value, field = "content") => {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, [field]: value } : b));
  };
  
  const handleBgChange = (id, value) => {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, bgColor: value } : b));
  };
  
  const handleResize = (id, width, height) => {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, width, height } : b));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      setBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mon Portfolio</h1>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
          >
            {isEditing ? 'Prévisualiser' : 'Modifier'}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8 w-full px-4 flex-1">
        {/* Profil */}
        <div className="flex flex-col items-center md:w-1/4 w-full mb-8 md:mb-0">
          <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center mb-6 relative group overflow-hidden shadow-lg">
            <img
              src={profile.photo || "/avatar.png"}
              alt=""
              className="w-full h-full object-cover cursor-pointer rounded-full"
              onClick={() => photoInputRef.current?.click()}
            />
            {isEditing && (
              <button
                className="absolute bottom-3 right-3 bg-blue-500 rounded-full p-2 shadow-md text-white opacity-0 group-hover:opacity-100 transition"
                onClick={() => photoInputRef.current?.click()}
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={photoInputRef}
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setProfile({...profile, photo: ev.target.result});
                  reader.readAsDataURL(file);
                }
                e.target.value = "";
              }}
            />
          </div>

          {isEditing ? (
            <>
              <input
                className="text-2xl font-bold mb-2 text-center bg-transparent outline-none border-b border-gray-300 focus:border-blue-500 px-4 py-1 transition-colors"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="Votre nom"
              />
              <textarea
                className="text-gray-600 text-center mb-6 bg-transparent outline-none border-b border-gray-300 focus:border-blue-500 px-4 py-1 resize-none w-full max-w-xs transition-colors"
                value={profile.desc}
                onChange={e => setProfile({...profile, desc: e.target.value})}
                rows={3}
                placeholder="Description courte..."
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center">{profile.name}</h2>
              <p className="text-gray-600 text-center mb-6">{profile.desc}</p>
            </>
          )}
        </div>

        {/* Blocs */}
        <div className="flex-1 w-full">
          {isEditing ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-min">
                  <AnimatePresence>
                    {blocks.map(block => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        handleContentChange={handleContentChange}
                        handleRemove={handleRemoveBlock}
                        handleBgChange={handleBgChange}
                        handleResize={handleResize}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-min">
              {blocks.map(block => (
                <div key={block.id} className="rounded-2xl overflow-hidden border border-gray-200 p-2 bg-white">
                  {block.type === "title" && (
                    <div 
                      className="w-full text-center font-bold text-2xl p-4 rounded-lg"
                      style={{ backgroundColor: block.bgColor || "#ffffff" }}
                    >
                      {block.content}
                    </div>
                  )}
                  {block.type === "image" && (
                    <img src={block.content} alt="Bloc" className="w-full h-auto object-cover rounded-lg" />
                  )}
                  {block.type === "text" && (
                    <div className="p-4 rounded-lg">
                      <p className="whitespace-pre-line">{block.content}</p>
                    </div>
                  )}
                  {block.type === "video" && (
                    <video src={block.content} controls className="w-full h-auto rounded-lg" />
                  )}
                  {block.type === "link" && (
                    <a 
                      href={block.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                    >
                      {block.content || block.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barre d'outils flottante */}
      {isEditing && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg z-40 border border-gray-200"
        >
          <TooltipButton 
            tooltip="Ajouter une image" 
            onClick={() => imageInputRef.current?.click()}
          >
            <ImagePlus className="w-6 h-6" />
          </TooltipButton>
          <TooltipButton 
            tooltip="Ajouter du texte" 
            onClick={() => handleAddBlock("text")}
          >
            <TextIcon className="w-6 h-6" />
          </TooltipButton>
          <TooltipButton 
            tooltip="Ajouter une vidéo" 
            onClick={() => videoInputRef.current?.click()}
          >
            <VideoIcon className="w-6 h-6" />
          </TooltipButton>
          <TooltipButton 
            tooltip="Ajouter un titre" 
            onClick={() => handleAddBlock("title")}
          >
            <TitleIco className="w-6 h-6" />
          </TooltipButton>
          <TooltipButton 
            tooltip="Ajouter un lien" 
            onClick={() => handleAddBlock("link")}
          >
            <LinkIco className="w-6 h-6" />
          </TooltipButton>

          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => handleAddBlock("image", ev.target.result);
                reader.readAsDataURL(file);
              }
              e.target.value = "";
            }}
          />
          
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => handleAddBlock("video", ev.target.result);
                reader.readAsDataURL(file);
              }
              e.target.value = "";
            }}
          />
        </motion.div>
      )}
    </div>
  );
}