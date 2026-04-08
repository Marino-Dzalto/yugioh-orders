import { NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { dbGetOrders, dbSaveOrders } from '@/lib/db';

export async function GET() {
  try {
    const orders = await dbGetOrders();
    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const order: Order = await req.json();
    const orders = await dbGetOrders();
    orders.unshift(order);
    await dbSaveOrders(orders);
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
