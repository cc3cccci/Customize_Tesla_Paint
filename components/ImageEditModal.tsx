
import React, { useState } from 'react';
import { X, Sparkles, Wand2, Download, Check, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Photo } from '../types';

interface ImageEditModalProps {
  photo: Photo;
  onClose: () => void;
  onSave: (newUrl: string) => void;
}

const SUGGESTIONS = [
  "Add a retro 70s film filter",
  "Make it look like a watercolor painting",
  "Add a dramatic sunset lighting",
  "Convert to high-contrast black and white",
  "Add a futuristic neon glow"
];

const ImageEditModal: React.FC<ImageEditModalProps> = ({ photo, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL.split(',')[1]);
      };
      img.onerror = () => reject(new Error('Failed to load image for editing'));
      img.src = url;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = await toBase64(photo.url);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ],
        },
      });

      let foundImage = false;
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const newUrl = `data:image/png;base64,${part.inlineData.data}`;
            setEditedImageUrl(newUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError("Gemini didn't return an image. Try a different prompt.");
      }
    } catch (err) {
      console.error(err);
      setError("Magic failed! Check your connection or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 md:p-4">
      <div className="bg-white dark:bg-card-dark w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Preview Area */}
        <div className="relative flex-[1.2] md:flex-1 bg-slate-100 dark:bg-background-dark p-4 md:p-6 flex items-center justify-center min-h-[40vh] md:min-h-0 overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-30"
          >
            <X size={20} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            {isGenerating && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl p-4 text-center">
                <Sparkles className="text-primary animate-pulse mb-4" size={48} />
                <p className="text-white font-bold animate-bounce text-sm md:text-base">Gemini is working its magic...</p>
              </div>
            )}
            
            <img 
              src={editedImageUrl || photo.url} 
              className={`max-w-full max-h-full object-contain rounded-xl shadow-lg transition-all duration-500 ${isGenerating ? 'scale-95 blur-sm' : 'scale-100 blur-0'}`}
              alt="Preview"
            />
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex-1 md:w-96 p-6 md:p-8 flex flex-col gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-border-dark overflow-y-auto bg-white dark:bg-card-dark">
          <div className="hidden md:flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wand2 className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">AI Image Magic</h2>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Instructions</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make it look like a Cyberpunk city..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary text-sm min-h-[80px] md:min-h-[100px] transition-all resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-[10px] px-3 py-1.5 rounded-full border border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate Result
            </button>

            {error && (
              <p className="text-red-500 text-xs text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                {error}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 flex gap-3 border-t border-slate-100 dark:border-border-dark">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!editedImageUrl}
              onClick={() => editedImageUrl && onSave(editedImageUrl)}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditModal;
