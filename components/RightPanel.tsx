import React, { useState } from 'react';
import { HistoryItem } from '../types';

interface RightPanelProps {
  isLoading: boolean;
  generatedImage: HistoryItem | null;
  onEditRequest: (prompt: string) => void;
  onDownload: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, generatedImage, onEditRequest, onDownload }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
        setEditPrompt(''); // Start with a blank prompt for a better user experience
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditPrompt('');
    };

    const handleConfirmEdit = () => {
        if (editPrompt.trim()) {
            onEditRequest(editPrompt);
            setIsEditing(false); // This will switch the view back after submitting
            setEditPrompt('');
        } else {
            alert("Por favor, descreva a edição que você deseja fazer.");
        }
    };

    // Common panel container classes
    const panelClasses = "right-panel w-full lg:w-2/3 bg-black p-6 flex items-center justify-center relative min-h-[50vh] lg:min-h-0 transition-all duration-300";

    if (isLoading) {
        return (
            <div className={panelClasses}>
                <div id="loadingContainer" className="loading-container text-center text-gray-300">
                    <div className="loading-spinner w-16 h-16 border-4 border-t-red-600 border-gray-700 rounded-full animate-spin mx-auto"></div>
                    <div className="loading-text mt-4 text-lg">Gerando sua imagem...</div>
                </div>
            </div>
        );
    }
    
    if (!generatedImage) {
        return (
            <div className={panelClasses}>
                <div id="resultPlaceholder" className="result-placeholder text-center text-gray-600">
                    <div className="result-placeholder-icon text-7xl">🎨</div>
                    <div className="mt-4 text-2xl">Sua obra de arte aparecerá aqui</div>
                </div>
            </div>
        );
    }
    
    // Focused Editing UI
    if (isEditing) {
        return (
            <div className={panelClasses}>
                <div className="w-full max-w-lg text-center flex flex-col items-center">
                     <h3 className="text-2xl font-bold text-white mb-2">Editar Imagem</h3>
                     <p className="text-gray-400 mb-4">Descreva a alteração que você deseja fazer.</p>
                     
                     <img src={generatedImage.imageDataUrl} alt="Editing preview" className="rounded-lg shadow-lg mx-auto mb-4 max-h-40 border-2 border-gray-700" />

                     <textarea
                         value={editPrompt}
                         onChange={(e) => setEditPrompt(e.target.value)}
                         placeholder="Ex: Adicione um chapéu, mude o fundo para uma praia..."
                         className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:outline-none transition duration-200 h-24 resize-none mb-4"
                         autoFocus
                     />
                     <div className="flex justify-center gap-4">
                         <button onClick={handleCancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancelar</button>
                         <button onClick={handleConfirmEdit} className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Confirmar</button>
                     </div>
                </div>
            </div>
        );
    }
    
    // Default view: Display generated image
    return (
        <div className={panelClasses}>
            <div id="imageContainer" className="image-container w-full h-full flex flex-col items-center justify-center">
              <img id="generatedImage" src={generatedImage.imageDataUrl} alt="Generated Art" className="generated-image max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"/>
              
              <div className="image-details bg-gray-900/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg mt-3 text-xs shadow-lg">
                <span className="font-semibold">Dimensões:</span> {generatedImage.width} x {generatedImage.height}px &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className="font-semibold">Tamanho:</span> {generatedImage.size} KB &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className="font-semibold">Criado em:</span> {new Date(generatedImage.createdAt).toLocaleString('pt-BR')}
              </div>

              <div className="absolute top-4 right-4 hidden lg:flex flex-col items-end space-y-2">
                    <button className="action-btn bg-gray-800/80 text-white p-3 rounded-full hover:bg-red-800 transition-colors shadow-lg" title="Editar" onClick={handleEditClick}>
                        ✏️
                    </button>
                    <button className="action-btn bg-gray-800/80 text-white p-3 rounded-full hover:bg-red-800 transition-colors shadow-lg" title="Download" onClick={onDownload}>
                        💾
                    </button>
              </div>
            </div>
        </div>
    );
};

export default RightPanel;