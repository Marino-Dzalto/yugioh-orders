export type Rarity =
  | 'SUPER RARE'
  | 'ULTRA RARE'
  | 'SECRET RARE'
  | 'COLLECTORS RARE'
  | 'ULTIMATE RARE'
  | 'PLATINUM SECRET RARE'
  | 'STARLIGHT RARE'
  | 'OVERFRAME ULTRA RARE'
  | 'OVERFRAME STARLIGHT RARE';

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
  discount?: number;
  status: OrderStatus;
  notes?: string;
}

export const RARITY_STYLE: Record<Rarity, { bg: string; text: string; border: string }> = {
  'SUPER RARE': { bg: '#1e0a3c', text: '#c084fc', border: '#7c3aed' },
  'ULTRA RARE': { bg: '#1f1000', text: '#fbbf24', border: '#d97706' },
  'SECRET RARE': { bg: '#002922', text: '#2dd4bf', border: '#0d9488' },
  'COLLECTORS RARE': { bg: '#1a0a00', text: '#fb923c', border: '#ea580c' },
  'ULTIMATE RARE': { bg: '#0a1a00', text: '#86efac', border: '#16a34a' },
  'PLATINUM SECRET RARE': { bg: '#1a1a1a', text: '#e2e8f0', border: '#94a3b8' },
  'STARLIGHT RARE': { bg: '#00001f', text: '#818cf8', border: '#6366f1' },
  'OVERFRAME ULTRA RARE': { bg: '#2a1500', text: '#fde047', border: '#ca8a04' },
  'OVERFRAME STARLIGHT RARE': { bg: '#10001f', text: '#e879f9', border: '#c026d3' },
};

export const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#422006', text: '#fbbf24', label: 'Na čekanju' },
  processing: { bg: '#0f2044', text: '#60a5fa', label: 'U obradi' },
  shipped: { bg: '#001a2e', text: '#00f5ff', label: 'Poslano' },
  completed: { bg: '#052e16', text: '#4ade80', label: 'Završeno' },
  cancelled: { bg: '#2d0000', text: '#f87171', label: 'Otkazano' },
};

export function calcOrderTotal(order: Order): number {
  const cardsTotal = order.cards.reduce((s, c) => s + c.quantity * c.price, 0);
  const discount = order.discount ?? 0;
  return Math.max(0, cardsTotal + order.shippingCost - discount);
}

export function calcCardsSubtotal(order: Order): number {
  return order.cards.reduce((s, c) => s + c.quantity * c.price, 0);
}
