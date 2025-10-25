"use client";
import Link from "next/link";

export default function AdminHeader() {
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/" className="site-title">vexs</Link>
        <span className="muted">/ Yönetim</span>
      </div>
      <nav className="nav">
        <Link href="/admin">Panel</Link>
        <Link className="btn" href="/admin/articles/new">Yeni Yazı</Link>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Çıkış</a>
      </nav>
    </div>
  );
}
