"use client";
import { useEffect, useRef, useState } from "react";
import { EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function RichTextEditor({ value, onChange, placeholder = "İçeriği buraya yazın..." }) {
  const [editor, setEditor] = useState(null);
  const fileInputRef = useRef(null);

  async function uploadImage(file) {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || 'Yüklenemedi');
    return j.url;
  }

  useEffect(() => {
    const e = new Editor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] }
        }),
        Placeholder.configure({ placeholder }),
        Link.configure({ openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] }),
        Image.configure({ inline: false, allowBase64: true })
      ],
      content: value || "<p></p>",
      onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
      editorProps: {
        handlePaste: (view, event) => {
          const dt = event.clipboardData;
          if (!dt) return false;
          const files = Array.from(dt.files || []);
          const image = files.find(f => f.type && f.type.startsWith('image/'));
          if (!image) return false;
          event.preventDefault();
          (async () => {
            try {
              const url = await uploadImage(image);
              e.chain().focus().setImage({ src: url, alt: image.name || 'image' }).run();
            } catch (err) {
              // noop
            }
          })();
          return true;
        },
        handleDrop: (view, event) => {
          const dt = event.dataTransfer;
          if (!dt) return false;
          const files = Array.from(dt.files || []);
          const image = files.find(f => f.type && f.type.startsWith('image/'));
          if (!image) return false;
          event.preventDefault();
          (async () => {
            try {
              const url = await uploadImage(image);
              e.chain().focus().setImage({ src: url, alt: image.name || 'image' }).run();
            } catch (err) {
              // noop
            }
          })();
          return true;
        },
        attributes: {
          class: 'tiptap-editor-content'
        }
      }
    });
    setEditor(e);
    return () => {
      e.destroy();
      setEditor(null);
    };
  }, []);

  useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return <div className="muted">Editör yükleniyor…</div>;

  const Button = ({ onClick, active, label, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className="btn"
      style={{
        padding: '6px 10px',
        background: active ? '#0a84ff' : '#f3f3f3',
        color: active ? '#fff' : '#111',
        border: '1px solid #ddd',
        borderRadius: 6
      }}
    >{label}</button>
  );

  function promptLink() {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Bağlantı URL', prev);
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name || 'image' }).run();
    } catch {}
    e.target.value = '';
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        <Button label="Geri" title="Geri al (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} />
        <Button label="İleri" title="Yinele (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} />
        <span className="muted" style={{ margin: '0 6px' }}>|</span>
        <Button label="H1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <Button label="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Button label="H3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="muted" style={{ margin: '0 6px' }}>|</span>
        <Button label="B" title="Kalın" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <Button label="I" title="İtalik" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <Button label="S" title="Üstü çizili" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
        <Button label="{ }" title="Kod" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
        <span className="muted" style={{ margin: '0 6px' }}>|</span>
        <Button label="• Liste" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Button label="1. Liste" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <Button label=">" title="Alıntı" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <Button label="—" title="Yatay Çizgi" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <span className="muted" style={{ margin: '0 6px' }}>|</span>
        <Button label="Bağlantı" active={editor.isActive('link')} onClick={promptLink} />
        <Button label="Kaldır" title="Bağlantıyı kaldır" onClick={() => editor.chain().focus().unsetLink().run()} />
        <Button label="Görsel" title="Görsel ekle (dosya/clipboard)" onClick={openFilePicker} />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: 'none' }} />
        <span className="muted" style={{ margin: '0 6px' }}>|</span>
        <Button label="Temizle" title="Biçimi temizle" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10, background: '#fff' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
