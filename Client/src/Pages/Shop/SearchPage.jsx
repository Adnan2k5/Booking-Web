import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Filter, X, GitCompare, Heart } from 'lucide-react';
import { getAllItems } from '../../Api/item.api';
import MainHeader from '../../components/shop/MainHeader';
import Footer from '../../components/shop/Footer';
import { useContext } from 'react';
import { CartContext } from '../Cart/CartContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { useFavorites } from '../../contexts/FavoritesContext';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = ['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment'];
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const limit = 12;

  useEffect(() => {
    setSearchInput(searchQuery);
    setSelectedCategory(categoryParam);
  }, [searchQuery, categoryParam]);

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllItems(page, limit, searchQuery, categoryParam);
      
      if (response.success) {
        setItems(response.message || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } else {
        setError('Failed to fetch search results');
      }
    } catch (err) {
      setError('Error loading search results');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchItems(currentPage);
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [searchQuery, categoryParam, currentPage]);

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/shop/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleCategoryFilter = (category) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    navigate(`/shop/search?${params.toString()}`);
  };

  const clearFilter = (filterType) => {
    const params = new URLSearchParams();
    if (filterType === 'search' && categoryParam) {
      params.set('category', categoryParam);
    } else if (filterType === 'category' && searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (params.toString()) {
      navigate(`/shop/search?${params.toString()}`);
    } else {
      navigate('/shop');
    }
  };

  const clearAllFilters = () => {
    navigate('/shop');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <span className="text-neutral-900 font-medium">Search Results</span>
        </nav>
      </div>

      {/* Search Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Search Products</h1>
          
          {/* Enhanced Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </form>

          {/* Active Filters */}
          {(searchQuery || categoryParam) && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-neutral-700">Active filters:</span>
              
              {searchQuery && (
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full text-sm border">
                  <Search className="h-4 w-4 text-neutral-500" />
                  <span>"{searchQuery}"</span>
                  <button onClick={() => clearFilter('search')} className="text-neutral-500 hover:text-neutral-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {categoryParam && (
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full text-sm border">
                  <Filter className="h-4 w-4 text-neutral-500" />
                  <span>{categoryParam}</span>
                  <button onClick={() => clearFilter('category')} className="text-neutral-500 hover:text-neutral-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <button
                onClick={clearAllFilters}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Summary */}
          {searchQuery && (
            <p className="text-neutral-600">
              {loading ? 'Searching...' : `${items.length} results for "${searchQuery}"${categoryParam ? ` in ${categoryParam}` : ''}`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-lg text-neutral-600">Searching products...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-16">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && searchQuery && items.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-900 mb-2">No results found</h3>
            <p className="text-neutral-600 mb-6">
              Try searching with different keywords or browse our categories
            </p>
            <Link to="/shop" className="text-orange-500 hover:text-orange-600 font-medium">
              Browse all products →
            </Link>
          </div>
        )}

        {/* No Search Query State */}
        {!loading && !searchQuery && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-900 mb-2">Start your search</h3>
            <p className="text-neutral-600 mb-6">
              Enter keywords to find the perfect adventure gear
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <Link to={`/product/${item._id}`} className="block h-64 relative overflow-hidden">
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
                  
                  <div className="p-4">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-medium text-neutral-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {item.price > 0 && (
                          <p className="font-bold text-neutral-900">€{item.price}</p>
                        )}
                        {item.rentalPrice > 0 && (
                          <p className="text-sm text-neutral-600">Rent: €{item.rentalPrice}/day</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (isInFavorites(item._id)) {
                              removeFromFavorites(item._id);
                            } else {
                              addToFavorites(item);
                            }
                          }}
                          className={`p-2 rounded-full text-sm font-medium transition-colors ${
                            isInFavorites(item._id)
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          title={isInFavorites(item._id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart size={16} fill={isInFavorites(item._id) ? 'currentColor' : 'none'} />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (isInComparison(item._id)) {
                              removeFromComparison(item._id);
                            } else {
                              addToComparison(item);
                            }
                          }}
                          className={`p-2 rounded-full text-sm font-medium transition-colors ${
                            isInComparison(item._id)
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          title={isInComparison(item._id) ? 'Remove from comparison' : 'Add to comparison'}
                        >
                          <GitCompare size={16} />
                        </button>
                        
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-neutral-900 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        )}
      </div>

      <Footer categories={categories} />
    </div>
  );
}