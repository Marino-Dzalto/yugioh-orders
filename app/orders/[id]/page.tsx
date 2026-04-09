'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { fetchOrder, updateOrder, deleteOrderApi } from '@/lib/api';
import {
  Order,
  OrderStatus,
  Rarity,
  RARITY_STYLE,
  STATUS_STYLE,
  calcCardsSubtotal,
  calcOrderTotal,
} from '@/lib/types';

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editCards, setEditCards] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);

  useEffect(() => {
    fetchOrder(id)
      .then((o) => {
        setOrder(o);
        if (o) setDiscountInput(o.discount ? o.discount.toString() : '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
          <span style={{ color: '#94a3b8' }}>Učitavanje...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
        <Navbar />
        <div style={{ textAlign: 'center', paddingTop: '4rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem' }}>🔍</p>
          <p>Narudžba nije pronađena</p>
          <Link href="/" style={{ color: '#8b5cf6', textDecoration: 'none' }}>← Natrag</Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setSaving(true);
    const updated = { ...order, status: newStatus };
    await updateOrder(updated);
    setOrder(updated);
    setSaving(false);
  };

  const handleDelete = async () => {
    await deleteOrderApi(order.id);
    router.push('/');
  };

  const handleRemoveCard = async (cardIndex: number) => {
    setSaving(true);
    const updated = { ...order, cards: order.cards.filter((_, i) => i !== cardIndex) };
    await updateOrder(updated);
    setOrder(updated);
    setSaving(false);
  };

  const handleDiscountSave = async () => {
    setSavingDiscount(true);
    const discount = parseFloat(discountInput) || 0;
    const updated = { ...order, discount: discount > 0 ? discount : undefined };
    await updateOrder(updated);
    setOrder(updated);
    setSavingDiscount(false);
  };

  const subtotal = calcCardsSubtotal(order);
  const total = calcOrderTotal(order);
  const discount = order.discount ?? 0;
  const status = STATUS_STYLE[order.status];

  const rarityOrder: Rarity[] = [
    'OVERFRAME STARLIGHT RARE',
    'OVERFRAME ULTRA RARE',
    'STARLIGHT RARE',
    'PLATINUM SECRET RARE',
    'ULTIMATE RARE',
    'COLLECTORS RARE',
    'SECRET RARE',
    'ULTRA RARE',
    'SUPER RARE',
  ];
  const grouped = rarityOrder
    .map((r) => ({ rarity: r, cards: order.cards.filter((c) => c.rarity === r) }))
    .filter((g) => g.cards.length > 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
      <Navbar />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Back + actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Natrag na listu
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              disabled={saving}
              style={{
                padding: '6px 12px',
                backgroundColor: status.bg,
                color: status.text,
                border: `1px solid ${status.text}40`,
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s} style={{ backgroundColor: '#12121e', color: '#e2e8f0' }}>
                  {STATUS_STYLE[s].label}
                </option>
              ))}
            </select>
            {confirmDelete ? (
              <>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#7f1d1d',
                    color: '#fca5a5',
                    border: '1px solid #dc2626',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Potvrdi brisanje
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#1e1e38',
                    color: '#94a3b8',
                    border: '1px solid #2d2d50',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Odustani
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#1e1e38',
                  color: '#f87171',
                  border: '1px solid #2d2d50',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Obriši
              </button>
            )}
          </div>
        </div>

        {/* Customer info */}
        <Section title="Kupac">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <InfoField label="Ime i prezime" value={order.customer.name} />
            <InfoField label="Telefon" value={order.customer.phone} />
            <InfoField label="Email" value={order.customer.email} />
            <InfoField label="Adresa" value={order.customer.address} />
          </div>
        </Section>

        {/* Cards grouped by rarity */}
        <div style={{ backgroundColor: '#12121e', border: '1px solid #1e1e38', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Karte
            </h2>
            <button
              onClick={() => setEditCards((v) => !v)}
              style={{
                padding: '4px 12px',
                backgroundColor: editCards ? '#2d2d50' : 'transparent',
                color: editCards ? '#a78bfa' : '#64748b',
                border: `1px solid ${editCards ? '#4c4c8a' : '#2d2d50'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {editCards ? 'Gotovo' : 'Uredi karte'}
            </button>
          </div>
          {grouped.map(({ rarity, cards }) => {
            const rs = RARITY_STYLE[rarity];
            const rarityTotal = cards.reduce((s, c) => s + c.quantity * c.price, 0);
            return (
              <div key={rarity} style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 14px',
                    backgroundColor: rs.bg,
                    borderRadius: '8px 8px 0 0',
                    borderLeft: `3px solid ${rs.border}`,
                  }}
                >
                  <span style={{ color: rs.text, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {rarity}
                  </span>
                  <span style={{ color: rs.text, fontSize: '0.85rem', fontWeight: 600 }}>
                    {rarityTotal.toFixed(2)}€
                  </span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0e0e1c', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e1e38' }}>
                      <th style={thStyle}>Karta</th>
                      <th style={{ ...thStyle, textAlign: 'center', width: '80px' }}>Kom.</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: '80px' }}>Cijena</th>
                      <th style={{ ...thStyle, textAlign: 'right', width: '90px' }}>Ukupno</th>
                      {editCards && <th style={{ ...thStyle, width: '40px' }} />}
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card, i) => {
                      const globalIndex = order.cards.findIndex(
                        (c) => c === card || (c.name === card.name && c.rarity === card.rarity && c.price === card.price && c.quantity === card.quantity)
                      );
                      return (
                        <tr key={i} style={{ borderBottom: i < cards.length - 1 ? '1px solid #16162a' : 'none' }}>
                          <td style={tdStyle}>{card.name}</td>
                          <td style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>×{card.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', color: '#94a3b8' }}>{card.price.toFixed(2)}€</td>
                          <td style={{ ...tdStyle, textAlign: 'right', color: '#e2e8f0', fontWeight: 600 }}>
                            {(card.quantity * card.price).toFixed(2)}€
                          </td>
                          {editCards && (
                            <td style={{ ...tdStyle, textAlign: 'center', padding: '6px 8px' }}>
                              <button
                                onClick={() => handleRemoveCard(globalIndex)}
                                disabled={saving}
                                style={{
                                  padding: '2px 7px',
                                  backgroundColor: 'transparent',
                                  color: '#f87171',
                                  border: '1px solid #3d1c1c',
                                  borderRadius: '4px',
                                  cursor: saving ? 'not-allowed' : 'pointer',
                                  fontSize: '0.8rem',
                                  lineHeight: '1.4',
                                  opacity: saving ? 0.5 : 1,
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <Section title="Iznos">
          <div style={{ maxWidth: '340px', marginLeft: 'auto' }}>
            <TotalRow label="Karte" value={`${subtotal.toFixed(2)}€`} />
            <TotalRow label={`Dostava (${order.shippingMethod})`} value={`${order.shippingCost.toFixed(2)}€`} />

            {/* Discount row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Popust (€)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDiscountSave()}
                  placeholder="0.00"
                  style={{
                    width: '80px',
                    padding: '4px 8px',
                    backgroundColor: '#16162a',
                    border: '1px solid #2d2d50',
                    borderRadius: '6px',
                    color: discount > 0 ? '#f87171' : '#64748b',
                    fontSize: '0.875rem',
                    outline: 'none',
                    textAlign: 'right',
                  }}
                />
                <button
                  onClick={handleDiscountSave}
                  disabled={savingDiscount}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#1e1e38',
                    color: savingDiscount ? '#64748b' : '#a78bfa',
                    border: '1px solid #2d2d50',
                    borderRadius: '6px',
                    cursor: savingDiscount ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {savingDiscount ? '...' : 'Spremi'}
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1e1e38', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem' }}>Ukupno</span>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.25rem' }}>{total.toFixed(2)}€</span>
            </div>
          </div>
        </Section>

        {order.notes && (
          <Section title="Napomene">
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>{order.notes}</p>
          </Section>
        )}

        <p style={{ color: '#334155', fontSize: '0.75rem', textAlign: 'right', marginTop: '1rem' }}>
          ID: {order.id} · Datum: {order.date}
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#12121e', border: '1px solid #1e1e38', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h2 style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '2px' }}>{label}</p>
      <p style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{value || '—'}</p>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{value}</span>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '8px 12px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textAlign: 'left', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '10px 12px', color: '#cbd5e1', fontSize: '0.875rem' };
