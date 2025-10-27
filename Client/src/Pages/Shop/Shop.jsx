import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../Cart/CartContext";
import { useLocation } from 'react-router-dom';
import MainHeader from "../../components/shop/MainHeader";
import FilterBar from "../../components/shop/FilterBar";
import HeroCarousel from "../../components/shop/HeroCarousel";
import CategoryFeatureGrid from "../../components/shop/CategoryFeatureGrid";
import ProductsGrid from "../../components/shop/ProductsGrid";
import PromoBanners from "../../components/shop/PromoBanners";
import BrandStrip from "../../components/shop/BrandStrip";
import Footer from "../../components/shop/Footer";

export default function AdventureShop() {
  const [items, setItems] = useState([]);
  const [categories] = useState(['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment']);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const productsRef = useRef(null);

  // Fetch items (supports extended filters)
  const fetchItems = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (typeof filters === 'string') {
        if (filters) params.append('search', filters);
      } else {
        const { search, category, page, limit, priceMin, priceMax, availability, minRating, brand, sortBy } = filters;
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (priceMin !== undefined && priceMin !== '') params.append('priceMin', priceMin);
        if (priceMax !== undefined && priceMax !== '') params.append('priceMax', priceMax);
        if (availability) params.append('availability', availability);
        if (minRating !== undefined && minRating !== '') params.append('minRating', minRating);
        if (brand) params.append('brand', brand);
        if (sortBy) params.append('sortBy', sortBy);
      }

      const url = `${baseUrl}api/items${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();
      // Backend returns items in `message` for compatibility
      setItems(data.message || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => { fetchItems({ category: selectedCategory }); }, [selectedCategory]);

  // On mount, read URL to set initial category/search state (supports direct navigation)
  useEffect(() => {
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || "";
    setSearchQuery(q);

    // If path matches /shop/category/:slug
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'shop' && parts[1] === 'category' && parts[2]) {
      // Convert slug back to title-case category (assume categories list contains proper names)
      const slug = parts[2];
      const found = categories.find(c => c.toLowerCase() === slug.toLowerCase());
      if (found) {
        setSelectedCategory(found);
        fetchItems({ search: q, category: found });
        return;
      }
    }

    // If path is /shop/search, fetch with search query
    if (path.startsWith('/shop/search')) {
      fetchItems({ search: q, category: selectedCategory });
      return;
    }

    // Default: fetch items (maybe with search)
    fetchItems({ search: q, category: selectedCategory });
  }, []);

  const handleSearch = (q, opts = {}) => {
    // Do not redirect. Update local state; fetching is controlled by `opts.skipFetch`.
    setSearchQuery(q);
    if (!opts.skipFetch) {
      fetchItems({ search: q, category: selectedCategory });
    }
  };

  const handleCategorySelect = (category) => {
    // Do not redirect. Toggle selection and fetch items accordingly.
    const currentSearch = searchQuery || new URLSearchParams(location.search).get('search') || "";
    if (selectedCategory === category) {
      setSelectedCategory("");
      fetchItems({ search: currentSearch });
    } else {
      setSelectedCategory(category);
      fetchItems({ search: currentSearch, category });
      // scroll to products area after layout updates
      setTimeout(() => {
        try {
          const el = productsRef.current;
          if (!el) return;
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // adjust for sticky header if present
          const header = document.querySelector('header');
          const headerHeight = header ? header.clientHeight : 80;
          window.scrollBy({ top: -headerHeight + 8, behavior: 'smooth' });
        } catch (err) {
          // ignore
        }
      }, 100);
    }
  };

  const removeFilter = (filter) => {
    if (filter === 'category') {
      setSelectedCategory("");
      fetchItems(searchQuery || "", "");
    }
    if (filter === 'search') {
      setSearchQuery("");
      fetchItems("", selectedCategory);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    fetchItems("", "");
  };

  return (
    <div className="w-full font-sans bg-neutral-50 text-neutral-900">
      {/* <AnnouncementBar /> */}
  <MainHeader categories={categories} selectedCategory={selectedCategory} onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
      <FilterBar search={searchQuery} category={selectedCategory} onClear={clearFilters} onRemoveFilter={removeFilter} />
      <HeroCarousel />
      <CategoryFeatureGrid />
      {/* Products grid: replaces separate product page navigation; shows all products with left filters */}
      <ProductsGrid items={items} categories={categories} selectedCategory={selectedCategory} search={searchQuery} addToCart={addToCart} onCategorySelect={handleCategorySelect} onSearch={handleSearch} onFilterChange={fetchItems} />
      <PromoBanners />
      <BrandStrip />
      <Footer categories={categories} />
    </div>
  );
}