export const SITE = {
  name: "vexs",
  domain: "vexs.space",
  url: "https://vexs.space"
};

export function canonicalFor(pathname) {
  try {
    return new URL(pathname, SITE.url).toString();
  } catch {
    return `${SITE.url}${pathname || ''}`;
  }
}

export function newsArticleJsonLd({ article }) {
  if (!article) return null;
  const url = canonicalFor(`/articles/${article.slug}`);
  const published = article.published_at ? new Date(article.published_at).toISOString() : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    inLanguage: 'en',
    headline: article.title,
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: url,
    image: article.thumbnail_url ? [article.thumbnail_url] : undefined,
    author: article.author?.name
      ? { '@type': 'Person', name: article.author.name }
      : { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.svg` }
    }
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    inLanguage: 'en',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/search?q={query}`,
      'query-input': 'required name=query'
    }
  };
}

export function breadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: canonicalFor(item.href || '/')
    }))
  };
}
