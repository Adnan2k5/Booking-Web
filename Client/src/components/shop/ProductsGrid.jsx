import React, { useState, useEffect, useRef } from 'react';
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
  // appliedSearch is the value actually used to filter / trigger server fetches.
  const [appliedSearch, setAppliedSearch] = useState(search || '');
  const [appliedCategory, setAppliedCategory] = useState(selectedCategory || '');
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');
  const [appliedAvailability, setAppliedAvailability] = useState('any');
  const [appliedMinRating, setAppliedMinRating] = useState(0);
  const [appliedSortBy, setAppliedSortBy] = useState('relevance');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [availability, setAvailability] = useState('any'); // any | purchase | rent
  const [minRating, setMinRating] = useState(0);
  
  const [sortBy, setSortBy] = useState('relevance'); // relevance | price-asc | price-desc | rating-desc
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => { setLocalCategory(selectedCategory || ''); setAppliedCategory(selectedCategory || ''); }, [selectedCategory]);
  useEffect(() => { setLocalSearch(search || ''); setAppliedSearch(search || ''); }, [search]);

  // suggestions (debounced) for left-side search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!localSearch || localSearch.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${baseUrl}api/items?search=${encodeURIComponent(localSearch)}&limit=6`);
        const data = await res.json();
        const items = data?.message || data || [];
        setSuggestions(items.slice(0, 6));
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 220);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [localSearch]);

  // clicking outside should hide suggestions
  useEffect(() => {
    const onDoc = (e) => { if (e.target && !e.closest('.products-left-search')) setShowSuggestions(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // notify parent about filter changes (optional)
  // Only notify parent when applied filters change. This ensures typing doesn't trigger network calls.
  useEffect(() => {
    onFilterChange?.({
      search: appliedSearch,
      category: appliedCategory,
      priceMin: appliedPriceMin,
      priceMax: appliedPriceMax,
      availability: appliedAvailability,
      minRating: appliedMinRating,
      
      sortBy: appliedSortBy,
    });
  }, [appliedSearch, appliedCategory, appliedPriceMin, appliedPriceMax, appliedAvailability, appliedMinRating, appliedSortBy]);

  // filter locally as a safety-net; primary filtering happens on server via Shop fetch
  const filtered = items.filter(it => {
    if (localCategory && it.category && it.category.toLowerCase() !== localCategory.toLowerCase()) return false;
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
    <section className="maxs-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left filters */}
        <aside className="col-span-1 bg-white rounded-md p-4 shadow-sm">
          <h4 className="font-semibold mb-3">Filters</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative products-left-search">
              <input value={localSearch} onChange={e => { setLocalSearch(e.target.value); setShowSuggestions(true); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); /* only apply on Apply click */ setShowSuggestions(false); } }} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="Search products" />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-md z-20">
                  {suggestions.map((s, idx) => (
                    <button key={s._id || idx} type="button" onClick={() => { setLocalSearch(s.name || ''); setAppliedSearch(s.name || ''); onSearch?.(s.name || '', { skipFetch: true }); setShowSuggestions(false); }} className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden flex items-center justify-center">
                        {s.images?.[0] ? (
                          // small thumbnail
                          <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-xs text-neutral-400">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-neutral-900">{s.name}</div>
                        <div className="text-xs text-neutral-500">{s.category || s.brand || ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => {
                // Update Shop search state (without triggering its fetch) so FilterBar shows the query.
                onSearch?.(localSearch, { skipFetch: true });
                // Commit all staged filters which will trigger onFilterChange once via the applied state effect
                setAppliedSearch(localSearch);
                setAppliedCategory(localCategory);
                setAppliedPriceMin(priceMin);
                setAppliedPriceMax(priceMax);
                setAppliedAvailability(availability);
                setAppliedMinRating(minRating);
                setAppliedSortBy(sortBy);
                setShowSuggestions(false);
              }} className="bg-black text-white">Apply</Button>
              <Button size="sm" variant="ghost" onClick={() => {
                setLocalSearch(''); setAppliedSearch('');
                setLocalCategory(''); setAppliedCategory('');
                setPriceMin(''); setAppliedPriceMin('');
                setPriceMax(''); setAppliedPriceMax('');
                setAvailability('any'); setAppliedAvailability('any');
                setMinRating(0); setAppliedMinRating(0);
                setSortBy('relevance'); setAppliedSortBy('relevance');
                // Update Shop's visible search state but avoid duplicate fetch; the applied state effect will trigger a single fetch
                onSearch?.('', { skipFetch: true });
                setShowSuggestions(false);
              }}>Clear</Button>
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
