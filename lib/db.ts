import { Order } from './types';

const KV_KEY = 'yugioh_orders';

async function getKv() {
  const { kv } = await import('@vercel/kv');
  return kv;
}

export async function dbGetOrders(): Promise<Order[]> {
  const kv = await getKv();
  const orders = await kv.get<Order[]>(KV_KEY);
  return orders ?? [];
}

export async function dbSaveOrders(orders: Order[]): Promise<void> {
  const kv = await getKv();
  await kv.set(KV_KEY, orders);
}
