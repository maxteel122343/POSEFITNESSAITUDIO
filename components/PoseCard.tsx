
import React from 'react';
import { Pose } from '../types';

interface PoseCardProps {
  pose: Pose;
  onSelect: (pose: Pose) => void;
  isActive: boolean;
}

const PoseCard: React.FC<PoseCardProps> = ({ pose, onSelect, isActive }) => {
  return (
    <div 
      onClick={() => onSelect(pose)}
      className={`
        cursor-pointer group relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-1
        ${isActive ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200'}
      `}
    >
      <div className="aspect-square bg-slate-50 flex items-center justify-center p-4">
        {/* We use a colored circle background with an icon or stylized silhouette simulation */}
        <div className={`
          w-full h-full rounded-full flex items-center justify-center text-3xl transition-colors
          ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-400'}
        `}>
          <i className={`fas ${getCategoryIcon(pose.category)}`}></i>
        </div>
      </div>
      <div className="p-3 text-center">
        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
          {pose.name}
        </h3>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
          {pose.category}
        </p>
      </div>
    </div>
  );
};

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Lying': return 'fa-couch';
    case 'Sitting': return 'fa-chair';
    case 'Standing': return 'fa-walking';
    case 'Inverted': return 'fa-arrows-up-down';
    case 'Dynamic': return 'fa-bolt';
    default: return 'fa-user';
  }
}

export default PoseCard;
