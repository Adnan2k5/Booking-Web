import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductsGrid from '../../components/shop/ProductsGrid';
import MainHeader from '../../components/shop/MainHeader';
import Footer from '../../components/shop/Footer';

import { useContext } from 'react';
import { CartContext } from '../Cart/CartContext';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const categories = ['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment'];
  const category = categories.find(c => c.toLowerCase() === slug?.toLowerCase()) || '';
  const searchQuery = searchParams.get('search') || '';
  
  const limit = 12;
  // Use ProductsGrid for listing and filters. Provide server-side fetch handler.
  const fetchItems = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.priceMin !== undefined && filters.priceMin !== '') params.set('priceMin', filters.priceMin);
      if (filters.priceMax !== undefined && filters.priceMax !== '') params.set('priceMax', filters.priceMax);
      if (filters.availability) params.set('availability', filters.availability);
      if (filters.minRating !== undefined && filters.minRating !== '') params.set('minRating', filters.minRating);
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

      const url = `/api/items${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.message) {
        setItems(data.message || []);
        setTotalPages(Math.ceil((data.data?.total || 0) / limit));
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load for category page
    fetchItems({ page: currentPage, limit, search: searchQuery, category, sortBy });
  }, [slug, searchQuery, currentPage, sortBy, sortOrder]);

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <MainHeader categories={categories} onSearch={handleSearch} selectedCategory={category} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-neutral-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <MainHeader categories={categories} onSearch={handleSearch} selectedCategory={category} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <MainHeader categories={categories} onSearch={handleSearch} selectedCategory={category} />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm text-neutral-600">
          <Link to="/shop" className="hover:text-neutral-900">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-neutral-900 font-medium">{category}</span>
          {searchQuery && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-neutral-600">Search: "{searchQuery}"</span>
            </>
          )}
        </nav>
      </div>

      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{category}</h1>
            <p className="text-neutral-600">{searchQuery ? `${items.length} results for "${searchQuery}" in ${category}` : `${items.length} products in ${category}`}</p>
          </div>
        </div>

        {/* Use ProductsGrid (it includes filters + grid) */}
        <ProductsGrid items={items} categories={categories} selectedCategory={category} search={searchQuery} addToCart={addToCart} onCategorySelect={(c) => fetchItems({ category: c })} onSearch={(q) => fetchItems({ search: q })} onFilterChange={(f) => fetchItems({ ...f, category })} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-neutral-900 text-white'
                      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer categories={categories} />
    </div>
  );
}