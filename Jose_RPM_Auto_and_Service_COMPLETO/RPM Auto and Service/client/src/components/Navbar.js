import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: '🚗 Vehículos' },
    { to: '/citas', label: '📅 Citas' },
    { to: '/ventas', label: '💰 Ventas' },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🔧</span> RPM Auto & Service
      </div>
      <ul className="navbar-links">
        {links.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={pathname === l.to ? 'active' : ''}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
