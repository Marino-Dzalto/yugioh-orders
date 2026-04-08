export type Rarity =
  | 'COMMON'
  | 'RARE'
  | 'SUPER RARE'
  | 'ULTRA RARE'
  | 'SECRET RARE'
  | 'PRISMATIC SECRET RARE';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface CardItem {
  rarity: Rarity;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  cards: CardItem[];
  shippingMethod: string;
  shippingCost: number;
  status: OrderStatus;
  notes?: string;
}

export const RARITY_STYLE: Record<Rarity, { bg: string; text: string; border: string }> = {
  COMMON: { bg: '#1a1f2e', text: '#94a3b8', border: '#334155' },
  RARE: { bg: '#0f2044', text: '#60a5fa', border: '#2563eb' },
  'SUPER RARE': { bg: '#1e0a3c', text: '#c084fc', border: '#7c3aed' },
  'ULTRA RARE': { bg: '#1f1000', text: '#fbbf24', border: '#d97706' },
  'SECRET RARE': { bg: '#002922', text: '#2dd4bf', border: '#0d9488' },
  'PRISMATIC SECRET RARE': { bg: '#2d0033', text: '#f472b6', border: '#db2777' },
};

export const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#422006', text: '#fbbf24', label: 'Na čekanju' },
  processing: { bg: '#0f2044', text: '#60a5fa', label: 'U obradi' },
  shipped: { bg: '#1c1003', text: '#fb923c', label: 'Poslano' },
  completed: { bg: '#052e16', text: '#4ade80', label: 'Završeno' },
  cancelled: { bg: '#2d0000', text: '#f87171', label: 'Otkazano' },
};

export function calcOrderTotal(order: Order): number {
  const cardsTotal = order.cards.reduce((s, c) => s + c.quantity * c.price, 0);
  return cardsTotal + order.shippingCost;
}

export function calcCardsSubtotal(order: Order): number {
  return order.cards.reduce((s, c) => s + c.quantity * c.price, 0);
}
