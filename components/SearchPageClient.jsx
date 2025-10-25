'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticleList from './ArticleList';
import { FiSearch } from 'react-icons/fi';

export default function SearchPageClient({ initialArticles = [], initialQuery = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  // Fetch articles function
  const fetchArticles = useCallback(async (query, pageNum, append = false) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10'
      });
      
      if (query) {
        params.append('q', query);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching articles:', data.error);
        setLoading(false);
        return;
      }

      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Load initial articles on mount if no query
  useEffect(() => {
    if (initialArticles.length === 0 && !initialQuery) {
      fetchArticles('', 1, false);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchArticles(searchQuery, nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, searchQuery, fetchArticles]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('q')?.toString().trim() || '';
    
    // Update URL with search query
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
    
    // Reset and fetch new results
    setSearchQuery(query);
    setPage(1);
    setArticles([]);
    setHasMore(true);
    fetchArticles(query, 1, false);
  };

  return (
    <div>
      <form action="/search" method="get" className="search-bar" onSubmit={handleSearch}>
        <input
          className="search-input"
          type="text"
          name="q"
          defaultValue={searchQuery}
          placeholder="Search by keyword or title"
          aria-label="Search"
        />
        <button className="search-submit" type="submit" aria-label="Search">
          <FiSearch aria-hidden size={18} />
        </button>
      </form>
      
      {searchQuery ? (
        <p className="muted">Search: "{searchQuery}"</p>
      ) : (
        <p className="muted">All articles</p>
      )}
      
      <ArticleList articles={articles} layout="grid" />
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="muted">Loading...</p>
        </div>
      )}
      
      {hasMore && !loading && (
        <div ref={observerTarget} style={{ height: '20px' }} />
      )}
      
      {!hasMore && articles.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="muted">No more articles to load.</p>
        </div>
      )}
    </div>
  );
}
