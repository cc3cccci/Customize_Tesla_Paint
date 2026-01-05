
export interface Photo {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
    initial?: string;
    color?: string;
  };
  caption: string;
  likes: number;
  liked: boolean;
  disliked: boolean;
  aspectRatio: 'square' | 'portrait' | 'tall' | 'classic';
}

export interface Feedback {
  id: string;
  content: string;
  email?: string;
  createdAt: number;
}

export interface DesignIdea {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  likes: number;
  liked: boolean;
  createdAt: number;
}

export type Tab = 'home' | 'designs' | 'admin';
export type Language = 'en' | 'zh';
