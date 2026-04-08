'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        backgroundColor: '#12121e',
        borderBottom: '1px solid #1e1e38',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🃏</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.03em',
            }}
          >
            YuGiOh Orders
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          <NavLink href="/" active={pathname === '/'} label="Narudžbe" />
          <NavLink href="/add" active={pathname === '/add'} label="+ Nova narudžba" primary />
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  label,
  primary,
}: {
  href: string;
  active: boolean;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        padding: '6px 16px',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.15s',
        ...(primary
          ? {
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: '#fff',
              border: '1px solid #8b5cf6',
            }
          : active
          ? { backgroundColor: '#1e1e38', color: '#c084fc', border: '1px solid #2d2d50' }
          : { color: '#94a3b8', border: '1px solid transparent' }),
      }}
    >
      {label}
    </Link>
  );
}
