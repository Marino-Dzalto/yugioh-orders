import { Order } from './types';

const STORAGE_KEY = 'yugioh_orders';

const SEED_DATA: Order[] = [
  {
    id: 'seed-1',
    date: '2026-04-08',
    customer: {
      name: 'Mateo Tomić',
      phone: '0953962888',
      email: 'tomicmateotab@gmail.com',
      address: 'Karlovačka ul. 28 Split 21000',
    },
    cards: [
      { rarity: 'SUPER RARE', name: 'Primite Dragon Ether Beryl', quantity: 3, price: 3 },
      { rarity: 'SUPER RARE', name: 'Primite Lordly Lode', quantity: 3, price: 2 },
      { rarity: 'SUPER RARE', name: 'Bystial Dis Pater', quantity: 2, price: 2 },
      { rarity: 'SUPER RARE', name: 'Saryuja Skull Dread', quantity: 1, price: 0.5 },
      { rarity: 'SUPER RARE', name: 'Chaos Angel', quantity: 1, price: 4 },
      { rarity: 'SUPER RARE', name: 'Imsety, Glory of Horus', quantity: 3, price: 1 },
      { rarity: 'SECRET RARE', name: 'Lancea, Ancestral Dragon of the Ice Mountain', quantity: 1, price: 0.8 },
    ],
    shippingMethod: 'Box Now',
    shippingCost: 1.8,
    status: 'pending',
  },
];

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return SEED_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    return JSON.parse(stored) as Order[];
  } catch {
    return SEED_DATA;
  }
}

export function getOrder(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function deleteOrder(id: string): void {
  const orders = getOrders().filter((o) => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
