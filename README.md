vexs — Haber Sitesi (Next.js + Supabase)

Özellikler
- Next.js 14 (App Router) ile SSR/SSG
- Supabase veritabanı entegrasyonu (articles, tags, users, media)
- Güçlü SEO: metadata, Open Graph, Twitter, JSON‑LD (WebSite, NewsArticle, Breadcrumb)
- robots.txt, dinamik sitemap.xml, RSS feed (/rss.xml)
- Kategori sayfaları (/tag/[slug]) ve arama (/search)
- Inter Tight font, açık ve sade arayüz (#F8F8F8, #222)

Yönetim (Admin)
- Giriş: /admin/login (Supabase Auth e‑posta/şifre)
- Yetki: Giriş yapan kullanıcının e‑postası `users` tablosunda kayıtlı olmalı.
- Panel: /admin — yazılar listesi, /admin/articles/new — TipTap editörü ile içerik oluşturma
- Yükleme: Kapak görseli, Supabase Storage `media` bucket’ına sunucu üzerinden yüklenir.

Kurulum
1) Node 18+ kurulu olmalı.
2) .env oluşturun (.env.example dosyasını baz alın):

   NEXT_PUBLIC_SUPABASE_URL=https://qzzmwqdkacdhwjhpvaiv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY  # asla istemciye sızdırmayın

3) Paketleri yükleyin ve çalıştırın:

   npm install
   npm run dev

Notlar
- Service Role anahtarı yalnızca sunucu tarafında kullanılmalıdır. İstemci bundle’ına asla dahil etmeyin.
- Storage bucket ismi: media. Thumbnail URL’leri doğrudan public URL olarak saklanabilir.
- İçerik HTML ise XSS’e karşı sanitize edilmesi tavsiye edilir (üründe ekleyin).
 - Admin girişi için Supabase Auth’ta kullanıcı oluşturun, aynı e‑postayı `users` tablosunda editor olarak ekleyin.

Paketler
- TipTap editörü için aşağıdaki paketleri yükleyin:

  npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder

  İsterseniz bağlantı ve görsel gibi eklentileri de ekleyebilirsiniz:

  npm i @tiptap/extension-link @tiptap/extension-image

Yapı
- app/: sayfalar ve route handlers (sitemap, robots, rss)
- components/: Header, Footer, Article bileşenleri
- lib/: Supabase ve SEO yardımcıları
- public/: statik varlıklar (logo, og görseli)
