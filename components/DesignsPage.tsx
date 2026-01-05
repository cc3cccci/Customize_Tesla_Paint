
import React, { useState } from 'react';
import { Plus, Heart, Clock, TrendingUp, Send, Image as ImageIcon, User, Trash2 } from 'lucide-react';
import { DesignIdea, Language } from '../types';

interface DesignsPageProps {
  designs: DesignIdea[];
  onAddDesign: (design: Omit<DesignIdea, 'id' | 'likes' | 'liked' | 'createdAt'>) => void;
  onLikeDesign: (id: string) => void;
  language: Language;
}

const DesignsPage: React.FC<DesignsPageProps> = ({ designs, onAddDesign, onLikeDesign, language }) => {
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', author: '' });

  const t = {
    en: {
      title: "Paint Concepts",
      subtitle: "Discover and share unique car livery and paint ideas.",
      submitBtn: "Submit Scheme",
      newest: "Latest",
      popular: "Trending",
      formTitle: "Share your paint idea",
      inputTitle: "Scheme Name",
      inputAuthor: "Creator Name",
      inputDesc: "Visual Description",
      inputUrl: "Reference Image URL",
      post: "Publish Concept",
      cancel: "Cancel",
      noDesigns: "No concepts shared yet. Start the trend!",
    },
    zh: {
      title: "涂装创意",
      subtitle: "发现并分享独特的汽车涂装与配色方案。",
      submitBtn: "提交方案",
      newest: "最新",
      popular: "热门",
      formTitle: "分享你的配色点子",
      inputTitle: "方案名称",
      inputAuthor: "创作者",
      inputDesc: "视觉效果描述",
      inputUrl: "参考图链接",
      post: "发布方案",
      cancel: "取消",
      noDesigns: "暂无共享方案。开启潮流吧！",
    }
  }[language];

  const sortedDesigns = [...designs].sort((a, b) => {
    if (sortBy === 'likes') return b.likes - a.likes;
    return b.createdAt - a.createdAt;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.description) return;
    onAddDesign(formData);
    setFormData({ title: '', description: '', imageUrl: '', author: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-up">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
            <button 
              onClick={() => setSortBy('newest')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'newest' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <Clock size={14} />
              {t.newest}
            </button>
            <button 
              onClick={() => setSortBy('likes')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'likes' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <TrendingUp size={14} />
              {t.popular}
            </button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Submission Form */}
      {showForm && (
        <div className="bg-white dark:bg-card-dark rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-200 dark:border-border-dark animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-primary" size={20} />
            {t.formTitle}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.inputTitle}</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.inputAuthor}</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.inputUrl}</label>
                <input 
                  type="url" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-full flex flex-col">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t.inputDesc}</label>
                <textarea 
                  required rows={6}
                  className="w-full flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-4 mt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {t.cancel}
              </button>
              <button 
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send size={18} />
                {t.post}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Designs Grid */}
      {sortedDesigns.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-border-dark">
          <ImageIcon size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-medium">{t.noDesigns}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedDesigns.map(design => (
            <div key={design.id} className="bg-white dark:bg-card-dark rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-border-dark hover:shadow-xl transition-all duration-300 group flex flex-col">
              {design.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={design.imageUrl} 
                    alt={design.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{design.title}</h4>
                  <button 
                    onClick={() => onLikeDesign(design.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${design.liked ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
                  >
                    <Heart size={14} fill={design.liked ? "currentColor" : "none"} />
                    {design.likes}
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {design.description}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-border-dark flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <User size={14} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{design.author}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignsPage;
