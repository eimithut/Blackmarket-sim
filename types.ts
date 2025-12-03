
export enum ViewState {
  LOGIN = 'LOGIN',
  LOADING = 'LOADING',
  MARKET = 'MARKET',
  DETAILS = 'DETAILS',
  CART = 'CART',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  PAYMENT = 'PAYMENT',
  TAKEDOWN = 'TAKEDOWN'
}

export type Language = 'de' | 'en';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceBTC: number;
  seller: string;
  rating: number;
  trustLevel: number; // 0-100
  imageSeed: number;
  category: string;
  stock: number;
  origin: string;
  imageUrl?: string;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CartItem extends Product {
  quantity: number;
}
