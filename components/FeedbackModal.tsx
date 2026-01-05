
import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle2, X } from 'lucide-react';
import { Feedback, Language } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSendMessage: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, language, onSendMessage }) => {
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSendMessage({ content, email });
    setIsSubmitted(true);
    setContent('');
    setEmail('');
    
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  const t = {
    en: {
      title: "Custom Scheme Request",
      desc: "Describe a specific paint effect or livery you'd like to see.",
      labelContent: "Requirement / Effect Details",
      placeholderContent: "e.g. Chrome Red with carbon fiber accents...",
      labelEmail: "Email (Optional)",
      submit: "Submit Request",
      successTitle: "Request Received!",
      successDesc: "Our designers will look into this scheme.",
      close: "Close"
    },
    zh: {
      title: "定制方案需求",
      desc: "描述您想要看到的特定车漆效果或涂装细节。",
      labelContent: "需求 / 效果详情",
      placeholderContent: "例如：带碳纤维点缀的亮红色电镀漆...",
      labelEmail: "邮箱 (可选)",
      submit: "提交需求",
      successTitle: "提交成功！",
      successDesc: "我们的设计师将研究此配色方案。",
      close: "关闭"
    }
  }[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-card-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
              <MessageSquare size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.desc}</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.successTitle}</h3>
              <p className="text-slate-500">{t.successDesc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider ml-1">
                  {t.labelContent}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.placeholderContent}
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all resize-none text-slate-800 dark:text-slate-200"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider ml-1">
                  {t.labelEmail}
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-background-dark border-none ring-1 ring-slate-200 dark:ring-border-dark focus:ring-2 focus:ring-primary transition-all text-slate-800 dark:text-slate-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={!content.trim()}
                className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <Send size={18} />
                {t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
