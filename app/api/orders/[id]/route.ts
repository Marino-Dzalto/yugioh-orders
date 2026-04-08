import { NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { dbGetOrders, dbSaveOrders } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updated: Order = await req.json();
    const orders = await dbGetOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    orders[idx] = updated;
    await dbSaveOrders(orders);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orders = await dbGetOrders();
    await dbSaveOrders(orders.filter((o) => o.id !== id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
