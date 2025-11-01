import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const featureData = [
  {
    title: "Premium Camping Stoves",
    subtitle: "Cook anywhere with reliable performance",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1400&q=80",
    slug: "camping"
  },
  {
    title: "Ultralight Tents",
    subtitle: "Adventure ready, weather protected",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
    slug: "camping"
  },
  {
    title: "Technical Backpacks",
    subtitle: "Carry smarter & go farther",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
    slug: "equipment"
  },
  {
    title: "High Performance Footwear",
    subtitle: "Traction & comfort for any terrain",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80",
    slug: "footwear"
  }
];

export default function CategoryFeatureGrid() {
  const navigate = useNavigate();

  const handleShop = (slug) => {
    if (!slug) return;
    const params = new URLSearchParams();
    params.set('search', slug);
    navigate(`/shop/search?${params.toString()}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight mb-14">Featured Collections</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {featureData.map((f, i) => (
          <div key={i} className="group relative h-[260px] md:h-[300px] overflow-hidden rounded-xl">
            <img src={f.image} alt={f.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 className="text-white text-xl font-semibold drop-shadow-sm">{f.title}</h3>
              <p className="text-neutral-200 text-sm mt-1 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{f.subtitle}</p>
              <Button onClick={() => handleShop(f.slug)} aria-label={`Shop ${f.slug}`} className="bg-white text-black hover:bg-orange-500 hover:text-white rounded-full h-9 px-5 text-xs font-semibold tracking-wide w-fit translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                Shop Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
