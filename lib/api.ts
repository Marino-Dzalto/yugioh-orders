import { Order } from './types';
import { generateId } from './store';

export { generateId };

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrder(id: string): Promise<Order | null> {
  const orders = await fetchOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(order: Order): Promise<void> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to create order');
}

export async function updateOrder(order: Order): Promise<void> {
  const res = await fetch(`/api/orders/${order.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to update order');
}

export async function deleteOrderApi(id: string): Promise<void> {
  const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete order');
}
