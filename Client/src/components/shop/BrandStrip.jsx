import './brandstrip.css';

const brands = ['Opinel','Osprey','Patagonia','Platypus','Primus','Real','Jetboil','Big Agnes','Gregory','Suunto'];

export default function BrandStrip() {
  // Duplicate list for seamless loop
  const loopBrands = [...brands, ...brands];
  return (
    <section className="relative bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-sm font-semibold tracking-widest text-neutral-600 mb-10">TRUSTED BY OUTDOOR BRANDS</h2>
      </div>
      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="brand-marquee relative">
        <div className="brand-track">
          {loopBrands.map((b, i) => (
            <div key={i + b} className="brand-item grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
              <img
                src={`https://placehold.co/160x60?text=${encodeURIComponent(b)}`}
                alt={`${b} logo`}
                loading="lazy"
                className="h-10 md:h-14 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

