import { Link } from "react-router-dom";
import { useRef, useContext, useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { 
  Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, 
  Home, Phone, Mail, Facebook, Instagram, Menu, X, User, 
  ChevronDown, MapPin
} from "lucide-react";
import { CartContext } from "../Cart/CartContext";

export default function AdventureShop() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState(['Camping', 'Clothing', 'Footwear', 'Accessories', 'Equipment']);
  const scrollRef = useRef(null);
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

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(searchQuery);
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: direction === "left" ? -880 : 880, behavior: "smooth" });
  };

  return (
    <div className="w-full font-sans">
      {/* Top bar with contact info and social */}
      <div className="bg-gray-900 text-white px-6 py-2 text-xs hidden md:flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-3 w-3 mr-1" />
            <span>contact@adventureshop.com</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>123 Adventure St, Outdoorville</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <a href="#" className="hover:text-orange-300 transition">
            <Facebook className="h-3 w-3" />
          </a>
          <a href="#" className="hover:text-orange-300 transition">
            <Instagram className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-black text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-orange-300">Adventure Shop</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {categories.map((category) => (
                <Link 
                  key={category} 
                  to={`/category/${category.toLowerCase()}`} 
                  className="text-sm font-medium hover:text-orange-300 transition"
                >
                  {category}
                </Link>
              ))}
            </nav>

            {/* Search, Cart, Account - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="px-4 py-2 rounded-full text-black w-64 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <button type="submit" className="absolute right-3 top-2.5">
                    <Search className="h-4 w-4 text-gray-500" />
                  </button>
                </form>
              </div>
              <Link to="/account">
                <Button variant="ghost" size="icon" className="text-white hover:text-orange-300 transition">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="text-white hover:text-orange-300 transition">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-white hover:text-orange-300 transition">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-white">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700 mt-4 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full text-black focus:outline-none"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
              </form>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="block text-sm py-2 font-medium hover:text-orange-300 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-700 flex justify-between">
                <Link to="/account" className="text-sm font-medium hover:text-orange-300 transition flex items-center">
                  <User className="h-4 w-4 mr-1" /> My Account
                </Link>
                <Link to="/favorites" className="text-sm font-medium hover:text-orange-300 transition flex items-center">
                  <Heart className="h-4 w-4 mr-1" /> Favorites
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] w-full bg-gray-200 bg-center bg-cover overflow-hidden" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')" 
        }}>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-center px-6 md:px-10">
            <div className="max-w-xl">
              <span className="bg-orange-500 text-white px-4 py-1 text-sm font-semibold uppercase tracking-wider inline-block mb-6">New Season Collection</span>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Gear Up For Your <span className="text-orange-300">Next Adventure</span>
              </h1>
              <p className="text-gray-200 text-lg mb-8 max-w-md">
                Discover premium outdoor equipment and apparel designed for the ultimate adventure experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-base font-medium transition-all transform hover:-translate-y-1">
                  Shop New Arrivals
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full text-base font-medium transition-all">
                  Browse Collections
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="hidden md:block absolute -bottom-10 -right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>
      </section>
      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">FEATURED CATEGORIES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Premium Camping Stoves",
              subtitle: "Cook anywhere with reliable performance",
              image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
              category: "cooking"
            },
            {
              title: "Ultralight Tents",
              subtitle: "Adventure ready, weather protected",
              image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
              category: "shelters"
            }
          ].map((item, index) => (
            <div key={index} className="group relative h-[300px] overflow-hidden rounded-lg shadow-lg">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 transform transition-all duration-300">
                <h2 className="text-white text-2xl font-bold mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.subtitle}
                </p>
                <Button className="w-fit bg-white text-black hover:bg-orange-500 hover:text-white rounded-md transition transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 duration-300">
                  Shop Collection
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition">All</button>
            {categories.map((category) => (
              <button 
                key={category}
                className="px-6 py-2 rounded-full bg-white text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="max-w-7xl mx-auto py-16 px-6 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold">RECOMMENDED FOR YOU</h2>
          <Link to="/all-products" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Scroll Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 snap-x snap-mandatory scroll-smooth"
          >
            {items.map((item, i) => (
              <div
                key={item._id || i}
                className="min-w-[260px] max-w-[260px] snap-start group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/product/${item._id}`}>
                  <div className="h-48 bg-gray-50 relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                    
                    {/* Quick actions overlay */}
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-md"
                      >
                        <Heart className="h-4 w-4 text-gray-700" />
                      </Button>
                    </div>
                    
                    {/* New tag */}
                    {i < 3 && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase">{item.brand}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★</span>
                      <span className="text-gray-300">★</span>
                    </div>
                  </div>
                  
                  <Link to={`/product/${item._id}`}>
                    <h3 className="text-sm font-medium line-clamp-2 h-10 group-hover:text-orange-500 transition">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-lg font-bold text-gray-900">€{item.price}</p>
                    <Button 
                      onClick={() => addToCart(item)}
                      size="sm" 
                      className="bg-black hover:bg-orange-500 text-white rounded-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-orange-500 hover:text-white transition-colors"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-orange-500 hover:text-white transition-colors"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div
            className="relative bg-cover bg-center h-[250px] rounded-lg overflow-hidden group"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 transition-all duration-300 group-hover:from-black/80 group-hover:to-black/40">
              <div className="h-full w-full flex flex-col justify-center items-start p-8 space-y-4">
                <span className="bg-orange-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">Limited Time</span>
                <h3 className="text-orange-300 text-3xl font-bold">SUMMER SALE</h3>
                <p className="text-white font-semibold">Up to 40% OFF on premium camping gear</p>
                <Button className="mt-2 bg-white text-black hover:bg-orange-400 hover:text-white transition-colors transform hover:-translate-y-1 transition-transform">
                  SHOP THE SALE
                </Button>
              </div>
            </div>
          </div>

          <div className="relative bg-cover bg-center h-[250px] rounded-lg overflow-hidden group" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 transition-all duration-300 group-hover:from-black/80 group-hover:to-black/40">
              <div className="h-full w-full flex flex-col justify-center items-start p-8 space-y-4">
                <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">Gear Care</span>
                <h3 className="text-white text-3xl font-bold">EXTEND YOUR GEAR'S LIFE</h3>
                <p className="text-gray-200">Maintenance essentials for clothing and equipment</p>
                <Button className="mt-2 bg-white text-black hover:bg-blue-600 hover:text-white transition-colors transform hover:-translate-y-1 transition-transform">
                  EXPLORE GUIDES
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-blue-600/20 backdrop-blur-sm p-8 md:p-12 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Adventure Community</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive deals, adventure tips, and be the first to know about new gear arrivals.
            </p>
            
            <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <Button className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Subscribe
              </Button>
            </form>
            
            <p className="text-gray-400 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Brand Logos */}

      {/* Brand Logos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl text-center font-semibold text-gray-700 mb-10">TRUSTED BY LEADING OUTDOOR BRANDS</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['opinel', 'osprey', 'patagonia', 'platypus', 'primus', 'real'].map((brand, index) => (
              <div key={index} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                <img 
                  src={`https://placehold.co/200x80?text=${brand}`} 
                  alt={`${brand} logo`} 
                  className="h-12 md:h-16 object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h4 className="font-bold text-xl text-orange-300">Adventure Shop</h4>
            <p className="text-gray-400">Active leisure and tourism goods for your next adventure. Quality equipment for unforgettable experiences.</p>
            <p className="text-gray-300 font-semibold">Gear up for new stories.</p>
            
            <div className="flex space-x-4 pt-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              {categories.map((category) => (
                <li key={category}>
                  <a href={`/category/${category.toLowerCase()}`} className="hover:text-orange-300 transition-colors">
                    {category}
                  </a>
                </li>
              ))}
              <li><a href="/new-arrivals" className="hover:text-orange-300 transition-colors">New Arrivals</a></li>
              <li><a href="/sale" className="hover:text-orange-300 transition-colors">Sale Items</a></li>
            </ul>
          </div>
          
          {/* Column 3: Information */}
          <div>
            <h4 className="font-bold text-lg mb-4">Information</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-orange-300 transition-colors">About Us</a></li>
              <li><a href="/shipping" className="hover:text-orange-300 transition-colors">Shipping & Returns</a></li>
              <li><a href="/faq" className="hover:text-orange-300 transition-colors">FAQ</a></li>
              <li><a href="/terms" className="hover:text-orange-300 transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-orange-300 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-orange-400 mt-0.5" />
                <span>123 Adventure Street<br />Outdoorville, OD 12345<br />United States</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-orange-400" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-orange-400" />
                <a href="mailto:info@adventureshop.com" className="hover:text-orange-300 transition-colors">
                  info@adventureshop.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 Adventure Shop. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <img src="https://placehold.co/40x25?text=Visa" alt="Visa" className="h-8" />
              <img src="https://placehold.co/40x25?text=MC" alt="Mastercard" className="h-8" />
              <img src="https://placehold.co/40x25?text=Amex" alt="American Express" className="h-8" />
              <img src="https://placehold.co/40x25?text=PayPal" alt="PayPal" className="h-8" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}