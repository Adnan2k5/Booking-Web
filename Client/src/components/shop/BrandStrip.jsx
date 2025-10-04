const brands = ['Opinel','Osprey','Patagonia','Platypus','Primus','Real'];

export default function BrandStrip() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-sm font-semibold tracking-widest text-neutral-600 mb-10">TRUSTED BY OUTDOOR BRANDS</h2>
        <div className="flex flex-wrap justify-center gap-10 md:gap-14 items-center">
          {brands.map(b => (
            <div key={b} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
              <img src={`https://placehold.co/160x60?text=${encodeURIComponent(b)}`} alt={`${b} logo`} className="h-10 md:h-14 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
