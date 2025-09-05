import React, { useRef } from 'react';
import { ImageFile } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface UploadAreaProps {
  id: string;
  previewSrc: string | undefined;
  onImageSelect: (file: ImageFile | null) => void;
  title: string;
  subtitle: string;
  isDual?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ id, previewSrc, onImageSelect, title, subtitle, isDual = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToBase64(file);
        onImageSelect(imageFile);
      } catch (error) {
        console.error("Error converting file:", error);
        alert("Falha ao carregar a imagem.");
      }
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const baseClasses = "border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-center text-gray-400 cursor-pointer hover:border-red-600 hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden";
  const sizeClasses = isDual ? "p-4 h-28" : "p-6 h-36";

  return (
    <div className={`${baseClasses} ${sizeClasses}`} onClick={handleAreaClick}>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleImageUpload}
      />
      {previewSrc ? (
        <>
            <img src={`data:image/jpeg;base64,${previewSrc}`} alt="Preview" className="image-preview absolute inset-0 w-full h-full object-cover"/>
            <button 
                onClick={handleClearImage} 
                className="absolute top-1 right-1 bg-red-800/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-700 z-10"
                title="Remover imagem"
            >
                X
            </button>
        </>
      ) : (
        <div className={`flex ${isDual ? 'flex-row items-center space-x-3' : 'flex-col'}`}>
          <div className="text-3xl">📁</div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="upload-text text-xs">{subtitle}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;