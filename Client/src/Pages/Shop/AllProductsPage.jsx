import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { getAllItems } from '../../Api/item.api';
import MainHeader from '../../components/shop/MainHeader';
import Footer from '../../components/shop/Footer';
import { useContext } from 'react';
import { CartContext } from '../Cart/CartContext';

export default function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = ['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment'];
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const limit = 12;

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllItems(page, limit, searchQuery, categoryParam);
      
      if (response.success) {
        setItems(response.message || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [searchQuery, categoryParam, currentPage]);

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/shop/all-products?${params.toString()}`);
  };

  const handleCategoryFilter = (category) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    
    if (params.toString()) {
      navigate(`/shop/all-products?${params.toString()}`);
    } else {
      navigate('/shop/all-products');
    }
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    navigate('/shop/all-products');
    setSelectedCategory('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <MainHeader categories={categories} onSearch={handleSearch} selectedCategory={selectedCategory} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <MainHeader 
        categories={categories} 
        onSearch={handleSearch} 
        selectedCategory={selectedCategory}
      />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm text-neutral-600">
          <Link to="/shop" className="hover:text-neutral-900">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-neutral-900 font-medium">All Products</span>
          {searchQuery && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-neutral-600">Search: "{searchQuery}"</span>
            </>
          )}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-4">Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-neutral-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => handleCategoryFilter('')}
                      className="mr-3 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-neutral-700">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryFilter(category)}
                        className="mr-3 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-neutral-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">All Products</h1>
                <p className="text-neutral-600">
                  {loading ? 'Loading...' : (
                    searchQuery 
                      ? `${items.length} results for "${searchQuery}"${selectedCategory ? ` in ${selectedCategory}` : ''}`
                      : `${items.length} products${selectedCategory ? ` in ${selectedCategory}` : ''}`
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-lg text-neutral-600">Loading products...</div>
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                <div className="text-neutral-600 mb-4">No products found</div>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Clear filters to see all products →
                  </button>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && items.length > 0 && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {items.map((item) => (
                  <div key={item._id} className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''}`}>
                    <Link to={`/product/${item._id}`} className={`block relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                      {item.images?.[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                          No Image
                        </div>
                      )}
                    </Link>
                    
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <Link to={`/product/${item._id}`}>
                          <h3 className="font-medium text-neutral-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        {viewMode === 'list' && (
                          <div className="text-xs text-neutral-500 mb-3">
                            Category: {item.category}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {item.price > 0 && (
                            <p className="font-bold text-neutral-900">€{item.price}</p>
                          )}
                          {item.rentalPrice > 0 && (
                            <p className="text-sm text-neutral-600">Rent: €{item.rentalPrice}/day</p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-neutral-900 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNumber <= totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNumber
                              ? 'bg-neutral-900 text-white'
                              : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
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
        </div>
      </div>

      <Footer categories={categories} />
    </div>
  );
}