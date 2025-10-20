import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, Grid, List } from 'lucide-react';
import { getAllItems } from '../../Api/item.api';
import MainHeader from '../../components/shop/MainHeader';
import Footer from '../../components/shop/Footer';
import RecommendedSlider from '../../components/shop/RecommendedSlider';
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
  const [viewMode, setViewMode] = useState('grid');
  
  const categories = ['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment'];
  const category = categories.find(c => c.toLowerCase() === slug?.toLowerCase()) || '';
  const searchQuery = searchParams.get('search') || '';
  
  const limit = 12;

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllItems(page, limit, searchQuery, category);
      
      if (response.success) {
        setItems(response.message || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } else {
        setError('Failed to fetch items');
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
  }, [slug, searchQuery, currentPage]);

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
            <p className="text-neutral-600">
              {searchQuery ? `${items.length} results for "${searchQuery}" in ${category}` : `${items.length} products in ${category}`}
            </p>
          </div>
          
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

        {/* Products Grid */}
        {items.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
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
                
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
        ) : (
          <div className="text-center py-16">
            <div className="text-neutral-600 mb-4">No products found in this category</div>
            <Link to="/shop" className="text-orange-500 hover:text-orange-600 font-medium">
              Browse all products →
            </Link>
          </div>
        )}

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