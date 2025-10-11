import { useContext, useState, useEffect } from "react";
import { CartContext } from "../Cart/CartContext";
import AnnouncementBar from "../../components/shop/AnnouncementBar";
import MainHeader from "../../components/shop/MainHeader";
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
  const { addToCart } = useContext(CartContext);

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Fetch items
  const fetchItems = async (query = "") => {
    try {
      const url = query
        ? `${baseUrl}api/items?search=${encodeURIComponent(query)}`
        : `${baseUrl}api/items`;

      const response = await fetch(url);
      const data = await response.json();
      setItems(data.message || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSearch = (q) => fetchItems(q);

  return (
    <div className="w-full font-sans bg-neutral-50 text-neutral-900">
      {/* <AnnouncementBar /> */}
      <MainHeader categories={categories} onSearch={handleSearch} />
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