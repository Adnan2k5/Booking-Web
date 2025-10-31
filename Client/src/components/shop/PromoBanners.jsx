import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const promos = [
  {
    title: "Summer Sale",
    highlight: "Up to 40% Off",
    copy: "Premium camping gear and trail essentials",
    badge: "Limited Time",
    image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?auto=format&fit=crop&w=1400&q=80",
    slug: "clothing"
  },
  {
    title: "Care & Maintenance",
    highlight: "Extend Gear Life",
    copy: "Cleaning & waterproofing treatments",
    badge: "Gear Care",
    image: "https://images.unsplash.com/photo-1516914589923-f105f1535f88?auto=format&fit=crop&w=1400&q=80",
    slug: "accessories"
  }
];

export default function PromoBanners() {
  const navigate = useNavigate();

  const gotoCategory = (slug) => {
    if (!slug) return;
    navigate(`/shop/category/${slug}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pt-4 pb-20">
      <div className="grid md:grid-cols-2 gap-8">
        {promos.map((p, i) => (
          <div key={i} className="relative h-[240px] rounded-xl overflow-hidden group">
            <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 group-hover:from-black/80 group-hover:to-black/40 transition-colors" />
            <div className="relative z-10 h-full flex flex-col justify-center p-8">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-orange-500 text-white w-fit rounded-sm mb-2">{p.badge}</span>
              <h3 className="text-3xl font-bold text-white tracking-tight"><span className="text-orange-400">{p.highlight}</span></h3>
              <p className="text-neutral-200 text-sm font-medium">{p.copy}</p>
              <Button onClick={() => gotoCategory(p.slug)} aria-label={`Explore ${p.slug}`} className="mt-4 bg-white text-black hover:bg-orange-500 hover:text-white rounded-full h-9 px-6 text-xs font-semibold tracking-wide w-fit">Explore</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
