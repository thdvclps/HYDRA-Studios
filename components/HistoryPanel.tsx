import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="history-panel mt-4 p-3 bg-gray-800/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-300 font-semibold text-sm">📜 Histórico</h3>
        {history.length > 0 && (
            <button 
                onClick={onClear} 
                className="text-red-500 hover:text-red-400 text-xs font-semibold px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                title="Limpar histórico"
            >
                Limpar
            </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-gray-500 text-xs text-center py-4">Nenhuma imagem gerada ainda.</p>
      ) : (
        <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto pr-2">
          {history.map(item => (
            <div 
                key={item.id} 
                className="cursor-pointer aspect-square" 
                onClick={() => onSelect(item)}
                title="Clique para carregar esta imagem"
            >
              <img 
                src={item.imageDataUrl} 
                alt="History thumbnail" 
                className="w-full h-full object-cover rounded-md border-2 border-transparent hover:border-red-600 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;