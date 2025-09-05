import React, { useState, useEffect } from 'react';
import { Mode, CreateFunction, EditFunction, ImageFile, AspectRatio, HistoryItem } from './types';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

const HISTORY_STORAGE_KEY = 'ai-image-studio-history';

function App() {
  const [mode, setMode] = useState<Mode>('create');
  const [createFunction, setCreateFunction] = useState<CreateFunction>('free');
  const [editFunction, setEditFunction] = useState<EditFunction>('add-remove');
  const [prompt, setPrompt] = useState<string>('');
  const [image1, setImage1] = useState<ImageFile | null>(null);
  const [image2, setImage2] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComposingView, setIsComposingView] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const resetImages = () => {
    setImage1(null);
    setImage2(null);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    resetImages();
    setIsComposingView(false);
    setGeneratedImage(null);
  };

  const handleEditFunctionChange = (func: EditFunction, requiresTwo?: boolean) => {
    setEditFunction(func);
    resetImages();
    setIsComposingView(!!requiresTwo);
  };
  
  const handleEditRequest = (newPrompt: string) => {
    setMode('edit');
    setEditFunction('add-remove');
    setIsComposingView(false);
    setPrompt(newPrompt);
    // Note: The original image for editing is the 'generatedImage'
    if (generatedImage) {
      // Convert data URL back to ImageFile format for consistency
      const parts = generatedImage.imageDataUrl.split(';');
      const mimeType = parts[0].split(':')[1];
      const base64 = parts[1].split(',')[1];
      setImage1({ base64, mimeType });
    }
    setGeneratedImage(null); // Clear the result panel
    if (isModalOpen) setIsModalOpen(false);
  };

  const handleNewImage = () => {
    setMode('create');
    setCreateFunction('free');
    setPrompt('');
    resetImages();
    setGeneratedImage(null);
    setIsLoading(false);
    setIsComposingView(false);
    if(isModalOpen) setIsModalOpen(false);
  };

  const downloadImage = (imageItem: HistoryItem | null) => {
    if (!imageItem) return;
    const link = document.createElement('a');
    link.href = imageItem.imageDataUrl;
    link.download = `hydra-studios-image-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageGenerated = (imgDetails: Omit<HistoryItem, 'id' | 'createdAt'> | null) => {
    if (imgDetails) {
      const newHistoryItem: HistoryItem = {
        ...imgDetails,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setGeneratedImage(newHistoryItem);

      // Prepend new item and limit history size to avoid storage issues
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

      if (window.innerWidth < 1024) { // lg breakpoint
        setIsModalOpen(true);
      }
    } else {
      setGeneratedImage(null);
    }
  };

  const handleHistorySelect = (historyItem: HistoryItem) => {
    setGeneratedImage(historyItem);
    setMode('edit');
    setEditFunction('add-remove');
    setPrompt('');
    resetImages();
    setIsComposingView(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar o histórico? Esta ação não pode ser desfeita.')) {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };


  return (
    <div className="container mx-auto p-4 lg:p-6 min-h-screen flex flex-col">
      <main className="flex flex-col lg:flex-row bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex-grow max-h-[95vh]">
        <LeftPanel
          mode={mode}
          setMode={handleModeChange}
          createFunction={createFunction}
          setCreateFunction={setCreateFunction}
          editFunction={editFunction}
          setEditFunction={handleEditFunctionChange}
          prompt={prompt}
          setPrompt={setPrompt}
          image1={image1}
          setImage1={setImage1}
          image2={image2}
          setImage2={setImage2}
          isComposingView={isComposingView}
          setIsComposingView={setIsComposingView}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          setGeneratedImage={handleImageGenerated}
          history={history}
          onHistorySelect={handleHistorySelect}
          onClearHistory={handleClearHistory}
        />
        <RightPanel
          isLoading={isLoading}
          generatedImage={generatedImage}
          onEditRequest={handleEditRequest}
          onDownload={() => downloadImage(generatedImage)}
        />
      </main>
      <footer className="text-center text-gray-500 text-xs py-4">
        © {new Date().getFullYear()} HYDRA Studios. Todos os direitos reservados a: hydranetworking/thiagolopesz
      </footer>
      
      {isModalOpen && generatedImage && (
        <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-gray-900 border border-red-900 rounded-lg shadow-xl w-full max-w-sm flex flex-col items-center p-4">
            <img id="modalImage" src={generatedImage.imageDataUrl} alt="Generated Art" className="modal-image w-full h-auto object-contain rounded-md mb-4 max-h-[60vh]" />
            <div className="modal-actions grid grid-cols-3 gap-2 w-full">
              <button className="modal-btn edit bg-red-800 hover:bg-red-700 p-3 rounded-md flex flex-col items-center justify-center text-white" onClick={() => handleEditRequest('Refine this image by...')}>
                <span className="text-2xl">✏️</span> <span className="text-xs">Editar</span>
              </button>
              <button className="modal-btn download bg-gray-600 hover:bg-gray-500 p-3 rounded-md flex flex-col items-center justify-center text-white" onClick={() => downloadImage(generatedImage)}>
                <span className="text-2xl">💾</span> <span className="text-xs">Salvar</span>
              </button>
              <button className="modal-btn new bg-gray-700 hover:bg-gray-600 p-3 rounded-md flex flex-col items-center justify-center text-white" onClick={handleNewImage}>
                <span className="text-2xl">✨</span> <span className="text-xs">Nova</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;