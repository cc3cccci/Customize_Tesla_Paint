
import { Photo } from './types';

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    user: { username: '@porsche_fan', avatar: '', initial: 'P', color: 'bg-slate-900' },
    caption: 'Midnight Emerald Metallic - stunning depth in direct sunlight. 🏎️',
    likes: 452, liked: true, disliked: false, aspectRatio: 'classic',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
    user: { username: '@livery_design', avatar: '', initial: 'L', color: 'bg-blue-600' },
    caption: 'Frozen Marina Blue Matte finish on this G80. Aggressive and sleek.',
    likes: 289, liked: false, disliked: false, aspectRatio: 'tall',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop',
    user: { username: '@supercar_ops', avatar: '', initial: 'S', color: 'bg-red-500' },
    caption: 'Rosso Corsa never goes out of style. The ultimate glossy red.',
    likes: 810, liked: true, disliked: false, aspectRatio: 'portrait',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1544636331-e26859203199?q=80&w=800&auto=format&fit=crop',
    user: { username: '@wrap_king', avatar: '', initial: 'W', color: 'bg-amber-500' },
    caption: 'Liquid Gold Chrome wrap. Not for the faint of heart! ✨',
    likes: 156, liked: false, disliked: false, aspectRatio: 'square',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop',
    user: { username: '@classic_restos', avatar: '', initial: 'C', color: 'bg-stone-700' },
    caption: 'Vintage British Racing Green with cream accents. Timeless.',
    likes: 642, liked: false, disliked: false, aspectRatio: 'classic',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
    user: { username: '@jdm_daily', avatar: '', initial: 'J', color: 'bg-indigo-500' },
    caption: 'Midnight Purple III - that iconic color shift is insane.',
    likes: 1205, liked: true, disliked: false, aspectRatio: 'tall',
  }
];
