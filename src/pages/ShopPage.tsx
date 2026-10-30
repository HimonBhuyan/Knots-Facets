import React, { useState, useMemo } from 'react';
import { CATALOG } from '../data/catalog';
import { Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title'>('featured');

  const filteredProducts = useMemo(() => {
    let result = CATALOG.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="shop-page">
      <section className="page-banner">
        <span className="eyebrow">The Complete Atelier Catalog</span>
        <h1 className="page-title">Handcrafted Glass &amp; Slow Fibre</h1>
        <p className="page-subtitle">
          Every single item is made by hand with patient devotion. No two glass drops catch the light identically, and every crochet loop has its own story.
        </p>
      </section>

      <section className="section-block" style={{ paddingTop: '20px' }}>
        {/* Filter Toolbar */}
        <div className="filter-toolbar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Pieces
            </button>
            <button
              className={`filter-tab ${selectedCategory === 'jewellery' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('jewellery')}
            >
              Glass &amp; Crystal Jewellery
            </button>
            <button
              className={`filter-tab ${selectedCategory === 'crochet' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('crochet')}
            >
              Crochet &amp; Fibre
            </button>
            <button
              className={`filter-tab ${selectedCategory === 'gifting' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('gifting')}
            >
              Curated Gifting
            </button>
          </div>

          <div className="filter-controls">
            <div className="search-input-wrap">
              <Search className="search-icon" size={15} />
              <input
                type="text"
                placeholder="Search crystals, bags, sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} of {CATALOG.length} handcrafted pieces
        </div>

        {/* Product Grid */}
        <div className="product-grid" style={{ marginBottom: '80px' }}>
          {filteredProducts.length === 0 ? (
            <div className="empty-catalog-state">
              <span style={{ fontSize: '2.4rem' }}>🔍</span>
              <h3>No matching pieces found</h3>
              <p style={{ color: 'var(--ink-soft)', maxWidth: '440px', margin: '0 auto 20px' }}>
                We couldn't find anything matching "{searchQuery}". Try selecting another category or resetting your search.
              </p>
              <button
                className="btn-dark"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Studio Ethics */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', padding: 'clamp(28px, 4vw, 44px)', marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', textAlign: 'center' }}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✨</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', margin: '0 0 6px' }}>Prismatic Crystal Quality</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', margin: 0 }}>
                Genuine faceted glass and lead-free crystal elements wire-wrapped in 14k gold-filled and sterling silver.
              </p>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌿</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', margin: '0 0 6px' }}>Organic Natural Fibres</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', margin: 0 }}>
                Crochet creations knotted using 100% combed unbleached cotton, natural flax linen, and botanical dyes.
              </p>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💌</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', margin: '0 0 6px' }}>Wax-Sealed Presentation</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem', margin: 0 }}>
                Every order arrives wrapped in recycled tissue paper and sealed with an authentic studio wax impression.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
