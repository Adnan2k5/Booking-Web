import { useContext, useState, useEffect } from "react";
import { CartContext } from "../Cart/CartContext";
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from "../../components/shop/MainHeader";
import FilterBar from "../../components/shop/FilterBar";
import HeroCarousel from "../../components/shop/HeroCarousel";
import CategoryFeatureGrid from "../../components/shop/CategoryFeatureGrid";
import RecommendedSlider from "../../components/shop/RecommendedSlider";
import PromoBanners from "../../components/shop/PromoBanners";
import BrandStrip from "../../components/shop/BrandStrip";
import NewsletterSection from "../../components/shop/NewsletterSection";
import Footer from "../../components/shop/Footer";

export default function AdventureShop() {
  const [items, setItems] = useState([]);
  const [categories] = useState(['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment']);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Fetch items
  const fetchItems = async (query = "", category = "") => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category) params.append('category', category);
      const url = `${baseUrl}api/items${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();
      setItems(data.message || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => { fetchItems(undefined, selectedCategory); }, [selectedCategory]);

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
        fetchItems(q, found);
        return;
      }
    }

    // If path is /shop/search, fetch with search query
    if (path.startsWith('/shop/search')) {
      fetchItems(q, selectedCategory);
      return;
    }

    // Default: fetch items (maybe with search)
    fetchItems(q, selectedCategory);
  }, []);

  const handleSearch = (q) => {
    // Navigate to search page and include category if present
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (selectedCategory) params.set('category', selectedCategory);
  navigate(`/shop/search?${params.toString()}`);
    // Also fetch immediately so UI updates when staying on the same page
    fetchItems(q, selectedCategory);
    setSearchQuery(q);
  };

  const handleCategorySelect = (category) => {
    // Read current search query from URL if present
    const currentSearch = new URLSearchParams(location.search).get('search');

    if (selectedCategory === category) {
      // Deselect -> go to all-products (keeping search if any)
      const params = new URLSearchParams();
      if (currentSearch) params.set('search', currentSearch);
      navigate(`/shop/all-products${params.toString() ? `?${params.toString()}` : ''}`);
      setSelectedCategory("");
      fetchItems(currentSearch || "", "");
    } else {
      const slug = category.toLowerCase();
      const params = new URLSearchParams();
      if (currentSearch) params.set('search', currentSearch);
      navigate(`/shop/category/${slug}${params.toString() ? `?${params.toString()}` : ''}`);
      setSelectedCategory(category);
      fetchItems(currentSearch || "", category);
    }
  };

  const removeFilter = (filter) => {
    if (filter === 'category') {
      setSelectedCategory("");
  navigate('/shop/all-products');
      fetchItems(searchQuery || "", "");
    }
    if (filter === 'search') {
      setSearchQuery("");
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
  navigate(`${selectedCategory ? `/shop/category/${selectedCategory.toLowerCase()}` : '/shop/all-products'}${params.toString() ? `?${params.toString()}` : ''}`);
      fetchItems("", selectedCategory);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
  navigate('/shop/all-products');
    fetchItems("", "");
  };

  return (
    <div className="w-full font-sans bg-neutral-50 text-neutral-900">
      {/* <AnnouncementBar /> */}
  <MainHeader categories={categories} onSearch={handleSearch} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
  <FilterBar search={searchQuery} category={selectedCategory} onClear={clearFilters} onRemoveFilter={removeFilter} />
  <HeroCarousel />
      <CategoryFeatureGrid />
      <RecommendedSlider items={items} addToCart={addToCart} />
      <PromoBanners />
      <BrandStrip />
      <NewsletterSection />
      <Footer categories={categories} />
    </div>
  );
}