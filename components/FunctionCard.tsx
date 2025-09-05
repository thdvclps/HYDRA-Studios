import React from 'react';

interface FunctionCardProps {
  icon: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
  [key: string]: any; // Allow other data-* attributes
}

const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick, ...rest }) => {
  return (
    <div
      className={`function-card flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
        isActive ? 'bg-red-800 border-red-700 shadow-md text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-red-600'
      }`}
      onClick={onClick}
      {...rest}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-sm font-semibold mt-1 text-center">{name}</div>
    </div>
  );
};

export default FunctionCard;
