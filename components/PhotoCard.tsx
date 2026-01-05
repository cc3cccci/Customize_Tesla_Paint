
import React from 'react';
import { Download, Heart } from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLike, onDislike }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Could not download image. Cross-origin restrictions apply.');
    }
  };

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4.5]',
    tall: 'aspect-[3/5.5]',
    classic: 'aspect-[4/5]'
  };

  return (
    <div className="masonry-item group animate-fade-up">
      <div className="flex flex-col gap-3">
        {/* Image Container */}
        <div className={`relative w-full ${aspectClasses[photo.aspectRatio]} rounded-3xl overflow-hidden bg-slate-100 dark:bg-card-dark shadow-sm hover:shadow-xl transition-all duration-500`}>
          <img 
            src={photo.url} 
            alt={photo.caption}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-full text-[10px] font-bold hover:bg-slate-200 transition-colors shadow-lg"
                >
                  <Download size={14} />
                  <span>Save</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onLike(photo.id); }}
                  className={`p-2 rounded-full backdrop-blur-md transition-all ${photo.liked ? 'bg-primary text-white scale-110' : 'bg-white/20 text-white hover:bg-white/40'}`}
                >
                  <Heart size={16} fill={photo.liked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Area */}
        <div className="px-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 mb-0.5">
            {photo.user.avatar ? (
              <img src={photo.user.avatar} className="h-6 w-6 rounded-full border border-white dark:border-border-dark" alt="" />
            ) : (
              <div className={`h-6 w-6 rounded-full ${photo.user.color || 'bg-slate-500'} flex items-center justify-center text-[10px] font-bold text-white`}>
                {photo.user.initial}
              </div>
            )}
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {photo.user.username}
            </span>
          </div>
          
          <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {photo.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
