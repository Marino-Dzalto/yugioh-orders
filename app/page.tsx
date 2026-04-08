'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getOrders } from '@/lib/store';
import { Order, OrderStatus, STATUS_STYLE, calcOrderTotal } from '@/lib/types';

const STATUSES: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Sve' },
  { key: 'pending', label: 'Na čekanju' },
  { key: 'processing', label: 'U obradi' },
  { key: 'shipped', label: 'Poslano' },
  { key: 'completed', label: 'Završeno' },
  { key: 'cancelled', label: 'Otkazano' },
];

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
          <span style={{ color: '#94a3b8' }}>Učitavanje...</span>
        </div>
      </div>
    );
  }

  const filtered = orders
    .filter((o) => filter === 'all' || o.status === filter)
    .filter(
      (o) =>
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + calcOrderTotal(o), 0);

  const stats = [
    { label: 'Ukupno narudžbi', value: orders.length, color: '#8b5cf6' },
    {
      label: 'Na čekanju',
      value: orders.filter((o) => o.status === 'pending').length,
      color: '#f59e0b',
    },
    {
      label: 'Završeno',
      value: orders.filter((o) => o.status === 'completed').length,
      color: '#4ade80',
    },
    { label: 'Prihod', value: `${totalRevenue.toFixed(2)}€`, color: '#2dd4bf' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#12121e',
                border: '1px solid #1e1e38',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: '1.75rem', fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search & filters */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Pretraži po imenu ili emailu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px 14px',
              backgroundColor: '#16162a',
              border: '1px solid #1e1e38',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={() => setFilter(s.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  backgroundColor: filter === s.key ? '#7c3aed' : '#1e1e38',
                  color: filter === s.key ? '#fff' : '#94a3b8',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#94a3b8',
              backgroundColor: '#12121e',
              borderRadius: '12px',
              border: '1px dashed #1e1e38',
            }}
          >
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</p>
            <p>Nema narudžbi</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const status = STATUS_STYLE[order.status];
  const total = calcOrderTotal(order);
  const cardCount = order.cards.reduce((s, c) => s + c.quantity, 0);

  return (
    <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#12121e',
          border: '1px solid #1e1e38',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: '1rem',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#7c3aed';
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#14142a';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e38';
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#12121e';
        }}
      >
        {/* Customer info */}
        <div>
          <p style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '2px' }}>
            {order.customer.name}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
            {order.customer.email} · {order.date}
          </p>
        </div>

        {/* Card count */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '2px' }}>Karata</p>
          <p style={{ color: '#c084fc', fontWeight: 600 }}>{cardCount}</p>
        </div>

        {/* Total */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '2px' }}>Ukupno</p>
          <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
            {total.toFixed(2)}€
          </p>
        </div>

        {/* Status */}
        <div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: status.bg,
              color: status.text,
              whiteSpace: 'nowrap',
            }}
          >
            {status.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
