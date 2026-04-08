'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { createOrder, generateId } from '@/lib/api';
import { CardItem, Rarity, Order } from '@/lib/types';

const RARITIES: Rarity[] = [
  'SUPER RARE',
  'ULTRA RARE',
  'SECRET RARE',
  'COLLECTORS RARE',
  'ULTIMATE RARE',
  'PLATINUM SECRET RARE',
  'STARLIGHT RARE',
  'OVERFRAME ULTRA RARE',
  'OVERFRAME STARLIGHT RARE',
];

const RARITY_COLORS: Record<Rarity, string> = {
  'SUPER RARE': '#c084fc',
  'ULTRA RARE': '#fbbf24',
  'SECRET RARE': '#2dd4bf',
  'COLLECTORS RARE': '#fb923c',
  'ULTIMATE RARE': '#86efac',
  'PLATINUM SECRET RARE': '#e2e8f0',
  'STARLIGHT RARE': '#818cf8',
  'OVERFRAME ULTRA RARE': '#fde047',
  'OVERFRAME STARLIGHT RARE': '#e879f9',
};

const emptyCard = (): CardItem => ({ rarity: 'SUPER RARE', name: '', quantity: 1, price: 0 });

export default function AddOrder() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Box Now');
  const [shippingCost, setShippingCost] = useState(1.8);
  const [notes, setNotes] = useState('');
  const [cards, setCards] = useState<CardItem[]>([emptyCard()]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const updateCard = (i: number, field: keyof CardItem, value: string | number) => {
    setCards((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const addCard = () => setCards((prev) => [...prev, emptyCard()]);
  const removeCard = (i: number) => { if (cards.length > 1) setCards((prev) => prev.filter((_, idx) => idx !== i)); };

  const cardsSubtotal = cards.reduce((s, c) => s + (c.quantity || 0) * (c.price || 0), 0);
  const grandTotal = cardsSubtotal + (shippingCost || 0);

  const handleSubmit = async () => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Ime kupca je obavezno');
    if (cards.some((c) => !c.name.trim())) errs.push('Sve karte moraju imati naziv');
    if (cards.some((c) => c.quantity < 1)) errs.push('Količina mora biti najmanje 1');

    if (errs.length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const order: Order = {
        id: generateId(),
        date: new Date().toISOString().slice(0, 10),
        customer: { name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() },
        cards: cards.map((c) => ({ ...c, quantity: Number(c.quantity), price: Number(c.price) })),
        shippingMethod: shippingMethod.trim() || 'Box Now',
        shippingCost: Number(shippingCost) || 0,
        status: 'pending',
        notes: notes.trim() || undefined,
      };
      await createOrder(order);
      router.push(`/orders/${order.id}`);
    } catch {
      setErrors(['Greška pri spremanju narudžbe. Pokušaj ponovno.']);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
      <Navbar />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Nova narudžba
        </h1>

        {errors.length > 0 && (
          <div style={{ backgroundColor: '#2d0000', border: '1px solid #dc2626', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem' }}>
            {errors.map((e) => <p key={e} style={{ color: '#fca5a5', fontSize: '0.875rem' }}>• {e}</p>)}
          </div>
        )}

        {/* Customer */}
        <FormSection title="Podaci o kupcu">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Ime i prezime *" value={name} onChange={setName} placeholder="Mateo Tomić" />
            <Field label="Telefon" value={phone} onChange={setPhone} placeholder="0953962888" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="email@gmail.com" type="email" />
            <Field label="Adresa dostave" value={address} onChange={setAddress} placeholder="Ulica br. Grad" />
          </div>
        </FormSection>

        {/* Cards */}
        <FormSection title="Karte">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0e0e1c',
                border: '1px solid #1e1e38',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '10px',
                borderLeft: `3px solid ${RARITY_COLORS[card.rarity]}`,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 80px 90px auto', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Naziv karte *</label>
                  <input value={card.name} onChange={(e) => updateCard(i, 'name', e.target.value)} placeholder="Naziv karte" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Raritet</label>
                  <select value={card.rarity} onChange={(e) => updateCard(i, 'rarity', e.target.value as Rarity)} style={{ ...inputStyle, color: RARITY_COLORS[card.rarity] }}>
                    {RARITIES.map((r) => (
                      <option key={r} value={r} style={{ color: RARITY_COLORS[r], backgroundColor: '#12121e' }}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Kom.</label>
                  <input type="number" min={1} value={card.quantity} onChange={(e) => updateCard(i, 'quantity', Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Cijena (€)</label>
                  <input type="number" min={0} step={0.1} value={card.price} onChange={(e) => updateCard(i, 'price', Number(e.target.value))} style={inputStyle} />
                </div>
                <div style={{ paddingBottom: '2px' }}>
                  <button onClick={() => removeCard(i)} disabled={cards.length === 1} style={{ padding: '8px 10px', backgroundColor: '#1e1e38', color: cards.length === 1 ? '#334155' : '#f87171', border: 'none', borderRadius: '6px', cursor: cards.length === 1 ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>✕</button>
                </div>
              </div>
              {card.name && card.quantity > 0 && card.price > 0 && (
                <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px', textAlign: 'right' }}>
                  {card.quantity} × {card.price.toFixed(2)}€ = <strong style={{ color: '#94a3b8' }}>{(card.quantity * card.price).toFixed(2)}€</strong>
                </p>
              )}
            </div>
          ))}
          <button onClick={addCard} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px dashed #2d2d50', borderRadius: '8px', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            + Dodaj kartu
          </button>
        </FormSection>

        {/* Shipping */}
        <FormSection title="Dostava">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px' }}>
            <Field label="Način dostave" value={shippingMethod} onChange={setShippingMethod} placeholder="Box Now" />
            <div>
              <label style={labelStyle}>Cijena dostave (€)</label>
              <input type="number" min={0} step={0.1} value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection title="Napomene (neobavezno)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Posebni zahtjevi..." rows={3} style={{ ...inputStyle, width: '100%', resize: 'vertical', fontFamily: 'inherit' }} />
        </FormSection>

        {/* Total + submit */}
        <div style={{ backgroundColor: '#12121e', border: '1px solid #1e1e38', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Ukupno za naplatu</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {cardsSubtotal.toFixed(2)}€ + {shippingCost.toFixed(2)}€ dostava =
              </span>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.4rem' }}>{grandTotal.toFixed(2)}€</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '12px 28px', background: submitting ? '#2d2d50' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Spremanje...' : 'Spremi narudžbu'}
          </button>
        </div>
      </main>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#12121e', border: '1px solid #1e1e38', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
      <h2 style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', backgroundColor: '#16162a', border: '1px solid #1e1e38', borderRadius: '7px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none' };
