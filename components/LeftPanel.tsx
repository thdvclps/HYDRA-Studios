import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { Mode, CreateFunction, EditFunction, ImageFile, AspectRatio, HistoryItem } from '../types';
import { CREATE_FUNCTIONS, EDIT_FUNCTIONS, ASPECT_RATIOS } from '../constants';
import { generateImage } from '../services/geminiService';
import FunctionCard from './FunctionCard';
import UploadArea from './UploadArea';
import HistoryPanel from './HistoryPanel';

interface LeftPanelProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  createFunction: CreateFunction;
  setCreateFunction: Dispatch<SetStateAction<CreateFunction>>;
  editFunction: EditFunction;
  setEditFunction: (func: EditFunction, requiresTwo?: boolean) => void;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  image1: ImageFile | null;
  setImage1: Dispatch<SetStateAction<ImageFile | null>>;
  image2: ImageFile | null;
  setImage2: Dispatch<SetStateAction<ImageFile | null>>;
  isComposingView: boolean;
  setIsComposingView: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  aspectRatio: AspectRatio;
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
  setGeneratedImage: (image: Omit<HistoryItem, 'id' | 'createdAt'> | null) => void;
  history: HistoryItem[];
  onHistorySelect: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

// FIX: Add JSX return to the component to render the UI and fix the type error.
const LeftPanel: React.FC<LeftPanelProps> = ({
  mode, setMode, createFunction, setCreateFunction, editFunction, setEditFunction,
  prompt, setPrompt, image1, setImage1, image2, setImage2,
  isComposingView, isLoading, setIsLoading, aspectRatio, setAspectRatio, setGeneratedImage,
  history, onHistorySelect, onClearHistory
}) => {

  const handleGenerateClick = useCallback(async () => {
    const currentFunction = mode === 'create' ? createFunction : editFunction;
    if (!prompt || isLoading || (mode === 'edit' && !image1)) {
        alert("Por favor, forneça um prompt e uma imagem (se estiver no modo de edição).");
        return;
    };

    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateImage(mode, currentFunction, prompt, image1, image2, aspectRatio);
      setGeneratedImage(result);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
      setGeneratedImage(null);
    } finally {
      setIsLoading(false);
    }
  }, [mode, createFunction, editFunction, prompt, image1, image2, isLoading, setIsLoading, setGeneratedImage, aspectRatio]);
  
  const isGenerateDisabled = isLoading || !prompt || (mode === 'edit' && !image1) || (isComposingView && !image2);

  const hydraLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX////u1NXl0M734d3/7+frzMn85+P/8/Lu1dXu09P96uXv19n85t7w2tn03Nzy29z239/649734d744uD13dzw2Nr/8/P/9/b13t365N/96+n65eD75uL/7ez44t/03Nv03Nr54+H+7Ozy3d7t0tA/cRVBAAAEKUlEQVR4nO3b63LiOhCGYdgQGxsJBAQIwSDEJv//T3pAEoSEyGkzbVrP2X9W1N46rVR9X904AwAAAAAAAAAAwG0k+R3Kk/U4n5fL/buoP/s9qL8s/38d2q/fP8v+5w7lGctv285+H053/D8X+14l/v8z2q8+r8v+9863rN99tqP9v5e2yv7v0j4j90T/z2x/7w+j/u/O8T588Ew3x36t5+98d/N9tT/y+0/y/29l/3d4/+73rT/y+4/+73tT/z+3/+w7/+w/eP8/+1p/vP/R7U/83rL/t/M+R7Gv+34321P/P7X//Pb//of/gA3H8D7w793+X9v9r++H33y/1/7B/9//7Uf9353+X9k/2f7f1f9P+3sv+7tH/3f9f++x7+g/e//P3rL/N/f+//z+1//T+2/7P9P5f1L+5/t/W7j/b/jvb//v6T+f9m+/8/+v+l/b/H+3+f9i/s/3/5/+P9f7d3/+7tH+3//f0n83/L/t/M/t/L+h/W/7//P6T+X9v+/+z/f+5/T+3/7e2f/f+v7T/Z/v/0/4/sv+7tH+3/39o/+/Y/s/2/x/W//f2f3/+3yft/+/Y/t/L/p/1/2f7f2//b3/+7h+2/3fs/+/s//+5//+p/f+p/b/H+3+f9i/e/7L/5/t/W7//dw/b//u2P//vh/Z/pv//s/+fsv+ztH+3/39k/++x/T+X9S+e/3fs/8/t/73df0n//2f7fzPtX+3//f1f9P8x7V/s/+n/X7H9P5f1P+z/b/b/jvb//v6f9P23/b/b/3v6fW//b/p/1P2z/7/H+n+X9S+t/WP8P6/27T/v/+7T/l/Z/t/8/tv937f/N+p+2//c5/b+X9D+s/7/l/a/9P8v7V7L/N+1/t/+vsv/3Of2/l/Q/rP+/Y/v/k/Z/lvavrP+fsv/3Of2/d3H//1z//4f2/+79/3n/x/r/b//vzP9w/3/W//+T9l9E++8T9x8d7f/y/n/y/qftv9//p+2/7f9v+/9j+/9T+3/X/l/U/y/s/2v7/3v7X7L9f87+/2n7f7//T9t/W/9/zv7X2/7X2P7XWv7Xsv/3W/7Xsv/3W/4X7P9/y/7fZ/v/sv3/sv1vWf/bbf9/ZfvflfU/bP9f2/6/tv9/bf+vs/2/K+v/n7T/V2X9f7H9fzPr/4v2/4v9v4v9vxfr/xft/xf7fxf7f5e0/xf7fxft/xf7f5e0/xe2/xf7f5fW/xe2/xf7f5fW/xet/xe2/xet/xet/y9a/1/y/n/I+v8j7P+PrP9/yPr/I+z/j6z/P7D+/0j7/6P0/0fp/4/S/x+l/z9K/3+U/v/I/f/R/P+h/f+h/f+h/f+h/f+h/f+R+v/R/v/Q/n/I/P/o/X/E/v8R+//Q/n/I/v9H7P+P1P8fsv4fWf8Psv4fWf8Psv4fWf8P0v8fsf4fsf4fsf4fsf4fsf4fsf4fsv4fsf4fsf4fsf4fsf4fsf4f0v4fsv4fsf4fsv4fsf4fsf4fsf4f0v4fsv4fsf4fsf4fsf4fsf4fsf4fsf4fsv4fsv4fsf4fsf4f0v4fsv4fsv4fsf4fsf4fsf4fsf4f0v4fsv4fsf4fsf4fsf4fsf4fsv4fsv4fsv4fsv4f0v4f0v4f0v4f0v4f0v4f0v4f0v4f0v4f0v4f0v4f0v4fsv4f0v4fsv4fsv4fsv4f0v4fsf4fsv4fsf4fsf4fsf4fsf4fsv4fsv4fsf4fsf4fsf4fsf4fsf4fsf4fsf4fsf4fsv4fsf4fsf4fsf4fsf4fsf";

  return (
    <div className="left-panel w-full lg:w-1/3 bg-gray-900 p-6 flex flex-col space-y-4 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center space-x-3 pb-4 border-b border-gray-800">
        <img src={hydraLogo} alt="Hydra Studios Logo" className="w-10 h-10 rounded-md" />
        <div>
          <h1 className="text-xl font-bold text-white">HYDRA Studios</h1>
          <p className="text-xs text-gray-400">Seu estúdio de criação de imagens AI</p>
        </div>
      </header>
      
      {/* Mode Switcher */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'create' ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => setMode('create')}
        >
          Criar
        </button>
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'edit' ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => setMode('edit')}
        >
          Editar
        </button>
      </div>

      {/* Function Selection */}
      <div className="function-selector">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">
          {mode === 'create' ? 'Escolha um estilo de criação' : 'Escolha uma função de edição'}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {mode === 'create' ? (
            CREATE_FUNCTIONS.map(f => (
              <FunctionCard
                key={f.id}
                icon={f.icon}
                name={f.name}
                isActive={createFunction === f.id}
                onClick={() => setCreateFunction(f.id)}
              />
            ))
          ) : (
            EDIT_FUNCTIONS.map(f => (
              <FunctionCard
                key={f.id}
                icon={f.icon}
                name={f.name}
                isActive={editFunction === f.id}
                onClick={() => setEditFunction(f.id, f.requiresTwo)}
              />
            ))
          )}
        </div>
      </div>

      {/* Inputs for Edit Mode */}
      {mode === 'edit' && (
        <div className={`grid gap-4 ${isComposingView ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <UploadArea
            id="image1"
            previewSrc={image1?.base64}
            onImageSelect={setImage1}
            title="Imagem 1"
            subtitle="Clique para carregar"
            isDual={isComposingView}
          />
          {isComposingView && (
            <UploadArea
              id="image2"
              previewSrc={image2?.base64}
              onImageSelect={setImage2}
              title="Imagem 2"
              subtitle="Clique para carregar"
              isDual={true}
            />
          )}
        </div>
      )}

      {/* Prompt Textarea */}
      <div className="flex-grow flex flex-col">
        <label htmlFor="prompt" className="text-sm font-semibold text-gray-400 mb-2">
          {mode === 'create' ? 'Descreva o que você quer criar' : 'Descreva a edição que você quer fazer'}
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'create' ? "Ex: Um astronauta surfando em um anel de saturno" : "Ex: Adicione óculos de sol no rosto"}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:outline-none transition duration-200 resize-none flex-grow min-h-[100px]"
        />
      </div>

      {/* Aspect Ratio for Create Mode */}
      {mode === 'create' && (
        <div>
          <label htmlFor="aspectRatio" className="text-sm font-semibold text-gray-400 mb-2 block">Proporção</label>
          <div className="grid grid-cols-5 gap-2">
            {ASPECT_RATIOS.map(ar => (
              <button
                key={ar.id}
                onClick={() => setAspectRatio(ar.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-md border-2 transition-colors ${aspectRatio === ar.id ? 'bg-red-800 border-red-700 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-red-600'}`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateClick}
        disabled={isGenerateDisabled}
        className="w-full bg-red-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center sticky bottom-0"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
            Gerando...
          </>
        ) : (
          'Gerar Imagem ✨'
        )}
      </button>
      
      <HistoryPanel 
        history={history}
        onSelect={onHistorySelect}
        onClear={onClearHistory}
      />
    </div>
  );
};

export default LeftPanel;