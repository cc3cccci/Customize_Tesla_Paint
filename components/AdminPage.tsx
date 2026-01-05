
import React, { useState, useEffect } from 'react';
// Fixed the "Cannot find name 'Heart'" error by adding Heart to the lucide-react imports.
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, Lock, Unlock, LogOut, ShieldAlert, ShieldCheck, KeyRound, MessageSquare, Clock, Mail, Trash, Lightbulb, Heart } from 'lucide-react';
import { Photo, Feedback, DesignIdea } from '../types';

interface AdminPageProps {
  photos: Photo[];
  feedbacks: Feedback[];
  designs: DesignIdea[];
  onAddPhoto: (photo: Photo) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onDeleteDesign: (id: string) => void;
}

const DEFAULT_PASSWORD = 'admin';

const AdminPage: React.FC<AdminPageProps> = ({ photos, feedbacks, designs, onAddPhoto, onDeletePhoto, onDeleteFeedback, onDeleteDesign }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'resources' | 'feedback' | 'designs'>('resources');
  
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({ url: '', caption: '', aspectRatio: 'portrait' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') setIsAuthenticated(true);
  }, []);

  const getStoredPassword = () => localStorage.getItem('admin_password') || DEFAULT_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === getStoredPassword()) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setError('Invalid administrator password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 1) return;
    localStorage.setItem('admin_password', newPassword);
    setPasswordUpdateSuccess(true);
    setNewPassword('');
    setTimeout(() => setPasswordUpdateSuccess(false), 3000);
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.url || !newPhoto.caption) return;
    const photo: Photo = {
      id: Date.now().toString(),
      url: newPhoto.url!,
      caption: newPhoto.caption!,
      aspectRatio: (newPhoto.aspectRatio as any) || 'portrait',
      likes: 0, liked: false, disliked: false,
      user: { username: '@admin', avatar: '', initial: 'AD', color: 'bg-primary' }
    };
    onAddPhoto(photo);
    setNewPhoto({ url: '', caption: '', aspectRatio: 'portrait' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-up">
        <div className="w-full max-w-sm bg-white dark:bg-card-dark rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-border-dark text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Restricted Access</h2>
          <p className="text-slate-500 text-sm mb-8">Enter the administrator password to manage system resources.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              className={`w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-background-dark border-none ring-1 transition-all focus:ring-2 focus:ring-primary ${error ? 'ring-red-500' : 'ring-slate-200 dark:ring-border-dark'}`}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
            {error && <div className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase flex items-center gap-1.5"><ShieldAlert size={12}/>{error}</div>}
            <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
              <Unlock size={18} /> Unlock Dashboard
            </button>
          </form>
          <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Default: admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Admin Panel</h2>
          <p className="text-slate-500">Manage gallery, feedback, and user designs.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button onClick={() => setActiveTab('resources')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'resources' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}>Gallery</button>
          <button onClick={() => setActiveTab('feedback')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'feedback' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}>
            Feedback {feedbacks.length > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{feedbacks.length}</span>}
          </button>
          <button onClick={() => setActiveTab('designs')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'designs' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}>
            Designs {designs.length > 0 && <span className="w-5 h-5 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{designs.length}</span>}
          </button>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-500 font-bold text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-200 dark:border-border-dark">
              <h3 className="font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-primary"/>Add Photo</h3>
              <form onSubmit={handleSubmitPhoto} className="space-y-4">
                <input required placeholder="URL" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark ring-1 ring-slate-200 dark:ring-border-dark" value={newPhoto.url} onChange={e => setNewPhoto({...newPhoto, url: e.target.value})} />
                <textarea required placeholder="Caption" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark ring-1 ring-slate-200 dark:ring-border-dark" value={newPhoto.caption} onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})} />
                <div className="flex gap-4">
                  <select className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark ring-1 ring-slate-200 dark:ring-border-dark" value={newPhoto.aspectRatio} onChange={e => setNewPhoto({...newPhoto, aspectRatio: e.target.value as any})}>
                    <option value="square">Square</option><option value="portrait">Portrait</option><option value="tall">Tall</option><option value="classic">Classic</option>
                  </select>
                  <button type="submit" className="bg-primary text-white px-8 rounded-xl font-bold">{success ? <CheckCircle2 size={20}/> : 'Add'}</button>
                </div>
              </form>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden">
               <div className="p-4 bg-slate-50 dark:bg-slate-800/50 font-bold border-b border-slate-100 dark:border-border-dark">Gallery Items ({photos.length})</div>
               <div className="max-h-[500px] overflow-y-auto">
                 {photos.map(p => (
                   <div key={p.id} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-100 dark:border-border-dark">
                     <div className="flex items-center gap-4">
                       <img src={p.url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                       <span className="text-sm font-medium line-clamp-1">{p.caption}</span>
                     </div>
                     <button onClick={() => onDeletePhoto(p.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-200 dark:border-border-dark h-fit">
              <h3 className="font-bold mb-4 flex items-center gap-2"><KeyRound size={20} className="text-amber-500"/>Security</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <input type="password" required placeholder="New password" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark ring-1 ring-slate-200 dark:ring-border-dark" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition-all ${passwordUpdateSuccess ? 'bg-emerald-500' : 'bg-slate-800'}`}>Update</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 font-bold border-b border-slate-100 dark:border-border-dark">User Feedback ({feedbacks.length})</div>
            {feedbacks.length === 0 ? (
              <div className="py-20 text-center text-slate-400">No feedback yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-border-dark">
                {feedbacks.map(f => (
                  <div key={f.id} className="p-6 flex justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase">
                        <Clock size={14}/> {new Date(f.createdAt).toLocaleString()}
                        {f.email && <><span className="text-slate-200 dark:text-slate-700">|</span> <Mail size={14}/> {f.email}</>}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{f.content}</p>
                    </div>
                    <button onClick={() => onDeleteFeedback(f.id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all self-start"><Trash size={18}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'designs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 font-bold border-b border-slate-100 dark:border-border-dark">User Designs ({designs.length})</div>
            {designs.length === 0 ? (
              <div className="py-20 text-center text-slate-400">No designs submitted yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-border-dark">
                {designs.map(d => (
                  <div key={d.id} className="p-6 flex justify-between gap-6">
                    <div className="flex gap-4">
                      {d.imageUrl && <img src={d.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt="" />}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{d.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full font-bold flex items-center gap-1"><Heart size={10} fill="currentColor"/> {d.likes}</span>
                        </div>
                        <p className="text-sm text-slate-500">By {d.author} • {new Date(d.createdAt).toLocaleDateString()}</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-2">{d.description}</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteDesign(d.id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all self-start"><Trash size={18}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
