import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X, GitCompare } from "lucide-react";

export default function MainHeader({ categories = [], onSearch, onCategorySelect, selectedCategory }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(query);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-orange-400">Adventure</span>Shop
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {categories.map(c => (
            <Link
              key={c}
              to={`/shop/category/${c.toLowerCase()}`}
              onClick={(e) => {
                // Prevent default navigation when using category filter from header
                if (onCategorySelect) {
                  e.preventDefault();
                  onCategorySelect(c);
                }
              }}
              aria-current={selectedCategory === c ? 'page' : undefined}
              className={`transition-colors font-medium ${selectedCategory === c ? 'text-orange-400 font-semibold underline underline-offset-4' : 'hover:text-orange-400'}`}
            >
              {c}
            </Link>
          ))}
        </nav>
        {/* Actions */}
        <div className="hidden md:flex items-center gap-5">
          <form onSubmit={submit} className="relative">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products" className="bg-neutral-800 text-sm rounded-full px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-3 text-neutral-400 hover:text-orange-400">
              <Search className="h-4 w-4" />
            </button>
          </form>
          <Link to="/favorites" className="hover:text-orange-400"><Heart className="h-5 w-5" /></Link>
          <Link to="/shop/comparison" className="hover:text-orange-400"><GitCompare className="h-5 w-5" /></Link>
          <Link to="/cart" className="relative hover:text-orange-400">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-[10px] leading-none rounded-full h-5 w-5 flex items-center justify-center font-semibold">0</span>
          </Link>
        </div>
        {/* Mobile toggle */}
        <button onClick={()=>setMobileOpen(o=>!o)} className="md:hidden p-2 rounded-md bg-neutral-800 hover:bg-neutral-700">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 px-6 pb-6 space-y-4 bg-black/95 backdrop-blur">
          <form onSubmit={submit} className="relative pt-4">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products" className="bg-neutral-800 w-full text-sm rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-4 text-neutral-400 hover:text-orange-400">
              <Search className="h-4 w-4" />
            </button>
          </form>
          <div className="grid gap-2">
            {categories.map(c => (
              <Link
                key={c}
                to={`/shop/category/${c.toLowerCase()}`}
                onClick={(e) => {
                  if (onCategorySelect) {
                    e.preventDefault();
                    onCategorySelect(c);
                  }
                  setMobileOpen(false);
                }}
                aria-current={selectedCategory === c ? 'page' : undefined}
                className={`py-2 border-b border-neutral-800 text-sm font-medium tracking-wide ${selectedCategory === c ? 'text-orange-400 font-semibold underline underline-offset-4' : ''}`}
              >
                {c}
              </Link>
            ))}
          </div>
          <div className="flex gap-6 pt-2 text-sm">
            <Link to="/favorites" onClick={()=>setMobileOpen(false)} className="hover:text-orange-400 flex items-center gap-1"><Heart className="h-4 w-4" /> Favorites</Link>
            <Link to="/shop/comparison" onClick={()=>setMobileOpen(false)} className="hover:text-orange-400 flex items-center gap-1"><GitCompare className="h-4 w-4" /> Compare</Link>
            <Link to="/account" onClick={()=>setMobileOpen(false)} className="hover:text-orange-400 flex items-center gap-1"><User className="h-4 w-4" /> Account</Link>
            <Link to="/cart" onClick={()=>setMobileOpen(false)} className="hover:text-orange-400 flex items-center gap-1"><ShoppingCart className="h-4 w-4" /> Cart</Link>
          </div>
        </div>
      )}
    </header>
  );
}
