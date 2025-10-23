import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useFavorites } from '../../contexts/FavoritesContext';

// Simple left-filter + product grid component
export default function ProductsGrid({ items = [], categories = [], selectedCategory = '', search = '', addToCart, onCategorySelect, onSearch, onFilterChange }) {
  const navigate = useNavigate();
  const [localCategory, setLocalCategory] = useState(selectedCategory || '');
  const [localSearch, setLocalSearch] = useState(search || '');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [availability, setAvailability] = useState('any'); // any | purchase | rent
  const [minRating, setMinRating] = useState(0);
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance'); // relevance | price-asc | price-desc | rating-desc

  useEffect(() => { setLocalCategory(selectedCategory || ''); }, [selectedCategory]);
  useEffect(() => { setLocalSearch(search || ''); }, [search]);

  // notify parent about filter changes (optional)
  useEffect(() => {
    onFilterChange?.({ search: localSearch, category: localCategory, priceMin, priceMax, availability, minRating, brand: brandFilter, sortBy });
  }, [localSearch, localCategory, priceMin, priceMax, availability, minRating, brandFilter, sortBy]);

  // filter locally as a safety-net; primary filtering happens on server via Shop fetch
  const filtered = items.filter(it => {
    if (localCategory && it.category && it.category.toLowerCase() !== localCategory.toLowerCase()) return false;
    if (brandFilter && it.brand && it.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
    if (localSearch) {
      const q = localSearch.toLowerCase();
      if (!((it.name && it.name.toLowerCase().includes(q)) || (it.brand && it.brand.toLowerCase().includes(q)))) return false;
    }
    if (priceMin !== '' && typeof it.price === 'number' && it.price < parseFloat(priceMin)) return false;
    if (priceMax !== '' && typeof it.price === 'number' && it.price > parseFloat(priceMax)) return false;
    if (availability === 'purchase' && (!it.purchase || it.purchaseStock <= 0)) return false;
    if (availability === 'rent' && (!it.rent || it.rentalStock <= 0)) return false;
    if (minRating && it.avgRating < minRating) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating-desc') return (b.avgRating || 0) - (a.avgRating || 0);
    return 0;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left filters */}
        <aside className="col-span-1 bg-white rounded-md p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Filters</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search</label>
            <input value={localSearch} onChange={e => setLocalSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onSearch?.(localSearch); }} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Search products" />
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => onSearch?.(localSearch)} className="bg-black text-white">Apply</Button>
              <Button size="sm" variant="ghost" onClick={() => { setLocalSearch(''); onSearch?.(''); }}>Clear</Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Price range (€)</label>
            <div className="flex gap-2">
              <input value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-1/2 px-2 py-1 border rounded-md text-sm" placeholder="Min" />
              <input value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-1/2 px-2 py-1 border rounded-md text-sm" placeholder="Max" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Availability</label>
            <select value={availability} onChange={e => setAvailability(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
              <option value="any">Any</option>
              <option value="purchase">For Purchase</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Minimum rating</label>
            <select value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-md text-sm">
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Brand name" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-desc">Rating</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categories</label>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setLocalCategory(''); onCategorySelect?.(''); }} className={`text-left text-sm py-1 ${!localCategory ? 'font-semibold text-orange-500' : 'text-neutral-700'}`}>All</button>
              {categories.map(c => (
                <button key={c} onClick={() => { setLocalCategory(c); onCategorySelect?.(c); }} className={`text-left text-sm py-1 ${localCategory === c ? 'font-semibold text-orange-500' : 'text-neutral-700'}`}>{c}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div key={item._id || i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => { if (item._id) navigate(`/product/${item._id}`); }}>
                <div className="h-56 bg-neutral-100 overflow-hidden flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-neutral-500">No Image</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs uppercase text-neutral-500">{item.brand}</p>
                    <h3 className="text-sm font-medium">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">€{item.price}</p>
                    <div className="flex items-center gap-2">
                      <FavoriteButton item={item} />
                      <Button
                        type="button"
                        size="sm"
                        className="bg-black text-white h-8 px-3 relative z-10 pointer-events-auto"
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          try {
                            await addToCart?.(item);
                            toast.success(`${item.name} added to cart`);
                          } catch (err) {
                            console.error('Add to cart failed', err);
                            toast.error('Failed to add to cart');
                          }
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-8 text-center text-neutral-600">No products found for current filters.</div>
          )}
        </div>
      </div>
    </section>
  );
}

// Small inline component to handle favorites UI & logic
function FavoriteButton({ item }) {
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();

  const inFav = isInFavorites(item._id);

  const handleFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (inFav) {
        removeFromFavorites(item._id);
        toast.success('Removed from favorites');
      } else {
        addToFavorites(item);
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Favorites update failed', err);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={inFav ? 'destructive' : 'ghost'}
      className={`h-8 w-8 relative z-10 pointer-events-auto ${inFav ? 'bg-red-100' : ''}`}
      onClick={handleFav}
      title={inFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-4 w-4 ${inFav ? 'text-red-500' : ''}`} fill={inFav ? 'currentColor' : 'none'} />
    </Button>
  );
}
