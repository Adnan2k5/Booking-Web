import { Link } from "react-router-dom";
import { useRef, useContext, useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Heart, Search, ShoppingCart, ChevronLeft, ChevronRight, Home, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { CartContext } from "../Cart/CartContext";

export default function AdventureShop() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      console.log("Fetched items from API:", data);
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
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Adventure Shop</div>
        <nav className="flex items-center gap-6">
          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-4 py-1 rounded-md text-grey w-48 bg-transparent border-b border-white focus:outline-none"
            />
            <button type="submit">
              <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
            </button>
          </form>
          </div>
          <Link to="/cart">
            <Button variant="ghost" className="text-white hover:text-gray-300 transition">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Banner */}
      <section className="relative h-[300px] w-full bg-gray-200 bg-center bg-cover" style={{ backgroundImage: "url('/your-banner.jpg')" }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-start px-10">
          <h1 className="text-white text-4xl font-bold max-w-xl leading-tight mb-4">
            Rain jackets<br /> for your adventures
          </h1>
        </div>
      </section>
      {/* Highlights */}
      
      {/* Recommended */}
      <section className="w-full px-4 md:px-12 py-8 space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center">RECOMMENDED</h2>

        {/* Scroll Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 snap-x snap-mandatory scroll-smooth"
          >
            {items.map((item, i) => (
              <div
                key={item._id || i}
                className="min-w-[220px] snap-start group border rounded-lg p-4 text-center space-y-2 shadow-sm hover:shadow-md transition hover:border-orange-300 relative hover:cursor-pointer"
              >
                <Link to={`/product/${item._id}`}>
                  <div className="h-36 bg-gray-100 mb-2 flex items-center justify-center relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No Image</span>
                    )}
                  </div>
                </Link>
                <p className="text-xs text-gray-500 font-semibold uppercase hover:text-orange-300 transition">{item.brand}</p>
                <p className="text-sm font-medium hover:text-orange-300 transition">{item.name}</p>
                <p className="text-base font-semibold">€{item.price}</p>

                {/* Actions */}
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add
                  </Button>
                  <Link to={`/product/${item._id}`}>
                    <Button variant="secondary" size="sm">
                      <Search className="h-4 w-4 mr-1" /> View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md z-10 hover:bg-orange-300 transition"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md z-10 hover:bg-orange-300 transition"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative bg-yellow-400 h-[200px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <h3 className="text-black text-xl font-bold">
        ADVENTURE <br /> GIFT CARD
      </h3>
      <p className="text-sm text-black">
        Give the gift of unforgettable experiences.
      </p>
              <Button className="bg-white text-black hover:bg-orange-400 hover:text-white transition">SELECT AMOUNT</Button>
            </div>
          </div>

          <div
    className="relative bg-cover bg-center h-[200px]"
    style={{ backgroundImage: "url('/sale-camping.jpg')" }}
  >
    <div className="bg-black/40 h-full w-full flex flex-col justify-center items-center text-center p-4 space-y-2">
      <h3 className="text-orange-300 text-xl font-bold">SUMMER SALE</h3>
      <p className="text-white font-semibold">Up to 40% OFF on camping gear</p>
      <Button className="bg-white text-black hover:bg-orange-400 hover:text-white transition">
        VIEW PRODUCTS
      </Button>
    </div>
  </div>

          <div className="relative bg-cover bg-center h-[200px]" style={{ backgroundImage: "url('/maintenance.jpg')" }}>
            <div className="bg-black/40 h-full w-full flex flex-col justify-center items-center text-center p-4 space-y-2">
              <h3 className="text-white font-semibold">Maintenance measures<br />for clothing and footwear</h3>
              <Button className="bg-white text-black hover:bg-orange-400 hover:text-white transition">VIEW PRODUCTS</Button>
            </div>
          </div>
        </div>
      </section>
      {/* Brand Logos */}

      <div className="flex flex-wrap justify-center items-center gap-12 py-10 bg-white">
        <img src="/logo-opinel.png" alt="Opinel" className="h-12" />
        <img src="/logo-osprey.png" alt="Osprey" className="h-14" />
        <img src="/logo-patagonia.png" alt="Patagonia" className="h-14" />
        <img src="/logo-platypus.png" alt="Platypus" className="h-10" />
        <img src="/logo-primus.png" alt="Primus" className="h-10" />
        <img src="/logo-real.png" alt="Real Turmat" className="h-10" />
      </div>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-20 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Tagline */}
        <div className="space-y-3">
          <div className="text-white text-2xl font-bold flex items-center gap-2">
            <span>FullSend<br />Adventure</span>
          </div>
          <p className="text-sm text-white">Active leisure and tourism goods</p>
          <p className="text-sm font-semibold text-white">Stuff for new stories.</p>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-bold mb-3">Information</h4>
          <ul className="space-y-2 text-sm text-white">
            <li><a href="#">Terms of use</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="font-bold mb-3">Contacts</h4>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-bold mb-3">Working hours</h4>
        </div>
      </footer>
    </div>
  );
}