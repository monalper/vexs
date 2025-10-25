"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="muted">Editor loading…</div>
});

export default function NewArticleForm({ tags = [] }) {
  const [title, setTitle] = useState("");
  const [tagId, setTagId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [html, setHtml] = useState("<p></p>");

  async function onUploadThumbnail(file) {
    setError("");
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Upload error');
      setThumbnailUrl(j.url);
    } catch (e) {
      setError(e.message || 'Upload failed');
    }
  }

  async function submit(publish) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: html, tag_id: tagId || null, thumbnail_url: thumbnailUrl || null, publish })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Could not save');
      window.location.href = `/articles/${j.slug}`;
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gap: 12 }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        <select value={tagId} onChange={(e) => setTagId(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}>
          <option value="">Category (optional)</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <div>
          <label className="muted" style={{ display: 'block', marginBottom: 6 }}>Cover image (optional)</label>
          {thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" style={{ maxWidth: 320, borderRadius: 8, marginBottom: 8 }} />}
          <input type="file" accept="image/*" onChange={(e) => onUploadThumbnail(e.target.files?.[0])} />
        </div>
        <div>
          <label className="muted" style={{ display: 'block', marginBottom: 6 }}>Content</label>
          <RichTextEditor value={html} onChange={setHtml} />
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="button" onClick={() => submit(false)} disabled={loading}>Save Draft</button>
          <button className="btn" type="button" onClick={() => submit(true)} disabled={loading} style={{ background: '#0a84ff' }}>Publish</button>
        </div>
      </div>
    </div>
  );
}

