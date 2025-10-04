import { Button } from "../../components/ui/button";

export default function NewsletterSection() {
  return (
    <section className="bg-neutral-900 py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">Join Our Adventure Community</h2>
        <p className="text-neutral-300 max-w-2xl mx-auto mb-8">Tips, field-tested gear insights & exclusive offers. One concise email — no spam.</p>
        <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input type="email" required placeholder="Email address" className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-7">Subscribe</Button>
        </form>
        <p className="text-neutral-500 text-xs mt-4">You can unsubscribe anytime.</p>
      </div>
    </section>
  );
}
