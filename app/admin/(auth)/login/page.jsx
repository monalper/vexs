"use client";
import { useState } from "react";
import Link from "next/link";
import { getPublicClient } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = getPublicClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { access_token, refresh_token } = data.session || {};
      if (!access_token || !refresh_token) throw new Error('Giriş başarısız');
      const r = await fetch('/api/auth/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, refresh_token })
      });
      if (!r.ok) {
        const j = await r.json();
        throw new Error(j?.error || 'Oturum açılamadı');
      }
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'Hata');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, padding: '40px 0' }}>
      <Link href="/" className="site-title">vexs</Link>
      <h1 className="section-title">Yönetim Girişi</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}</button>
        {error && <p className="muted" style={{ color: 'crimson' }}>{error}</p>}
      </form>
      <p className="muted" style={{ marginTop: 8 }}>Not: Giriş için e‑postanız "users" tablosunda kayıtlı olmalı.</p>
    </div>
  );
}
