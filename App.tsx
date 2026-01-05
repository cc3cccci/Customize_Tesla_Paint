
import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_PHOTOS } from './constants';
import { Photo, Tab, Feedback, Language, DesignIdea } from './types';
import Header from './components/Header';
import PhotoCard from './components/PhotoCard';
import BottomNav from './components/BottomNav';
import AdminPage from './components/AdminPage';
import DesignsPage from './components/DesignsPage';
import FeedbackModal from './components/FeedbackModal';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [designs, setDesigns] = useState<DesignIdea[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [language, setLanguage] = useState<Language>('en');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Load state from local storage
  useEffect(() => {
    const savedFeedback = localStorage.getItem('app_feedback');
    if (savedFeedback) {
      try { setFeedbacks(JSON.parse(savedFeedback)); } catch (e) {}
    }
    const savedDesigns = localStorage.getItem('app_designs');
    if (savedDesigns) {
      try { setDesigns(JSON.parse(savedDesigns)); } catch (e) {}
    }
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang === 'en' || savedLang === 'zh') setLanguage(savedLang as Language);
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('app_feedback', JSON.stringify(feedbacks));
    localStorage.setItem('app_designs', JSON.stringify(designs));
    localStorage.setItem('app_lang', language);
  }, [feedbacks, designs, language]);

  const t = {
    en: {
      categories: ['All', 'Metallic', 'Matte', 'Glossy', 'Pearlescent', 'Special'],
      suggestBtn: "Request Paint",
      appTitle: "Vehicle Paint Feed"
    },
    zh: {
      categories: ['全部', '金属漆', '磨砂漆', '亮面漆', '珠光漆', '特殊色'],
      suggestBtn: "定制方案",
      appTitle: "车漆效果展示"
    }
  }[language];

  const handleLike = useCallback((id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  }, []);

  const handleDislike = useCallback((id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, disliked: !p.disliked, liked: false } : p));
  }, []);

  const addPhoto = useCallback((photo: Photo) => setPhotos(prev => [photo, ...prev]), []);
  const deletePhoto = useCallback((id: string) => setPhotos(prev => prev.filter(p => p.id !== id)), []);
  
  const handleAddFeedback = useCallback((data: Omit<Feedback, 'id' | 'createdAt'>) => {
    setFeedbacks(prev => [{ ...data, id: Date.now().toString(), createdAt: Date.now() }, ...prev]);
  }, []);

  const handleDeleteFeedback = useCallback((id: string) => setFeedbacks(prev => prev.filter(f => f.id !== id)), []);

  const handleAddDesign = useCallback((data: Omit<DesignIdea, 'id' | 'likes' | 'liked' | 'createdAt'>) => {
    const newDesign: DesignIdea = {
      ...data,
      id: Date.now().toString(),
      likes: 0,
      liked: false,
      createdAt: Date.now()
    };
    setDesigns(prev => [newDesign, ...prev]);
  }, []);

  const handleLikeDesign = useCallback((id: string) => {
    setDesigns(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 };
      }
      return d;
    }));
  }, []);

  const handleDeleteDesign = useCallback((id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header language={language} setLanguage={setLanguage} appTitle={t.appTitle} />
      
      <main className="flex-1 w-full max-w-[1920px] mx-auto pb-32 px-4 sm:px-6 md:px-8 pt-6">
        {activeTab === 'home' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
              {t.categories.map((category, idx) => {
                const enCats = ['All', 'Metallic', 'Matte', 'Glossy', 'Pearlescent', 'Special'];
                const isSelected = activeCategory === enCats[idx];
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(enCats[idx])}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      isSelected 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                        : 'bg-white dark:bg-card-dark text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
              
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-border-dark shrink-0" />
              
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all border border-amber-200/50 dark:border-amber-800/50"
              >
                <Sparkles size={16} />
                <span>{t.suggestBtn}</span>
              </button>
            </div>

            <div className="masonry-columns">
              {photos.map(photo => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onLike={handleLike} 
                  onDislike={handleDislike} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'designs' && (
          <DesignsPage 
            designs={designs} 
            onAddDesign={handleAddDesign} 
            onLikeDesign={handleLikeDesign}
            language={language}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage 
            photos={photos} 
            feedbacks={feedbacks} 
            designs={designs}
            onAddPhoto={addPhoto} 
            onDeletePhoto={deletePhoto} 
            onDeleteFeedback={handleDeleteFeedback}
            onDeleteDesign={handleDeleteDesign}
          />
        )}
      </main>

      <div className="max-w-lg mx-auto w-full">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        language={language}
        onSendMessage={handleAddFeedback} 
      />
    </div>
  );
};

export default App;
