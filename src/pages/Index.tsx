import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[3/4] rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);

const SectionHeading = ({ label, title }: { label: string; title: string }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "animate-reveal-left opacity-100" : "opacity-0 -translate-x-8"}`}>
      <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <h2 className="font-display text-3xl font-semibold bg-gradient-to-r from-foreground via-foreground to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
        {title}
      </h2>
    </div>
  );
};

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const tryOnRef = useScrollReveal();
  const featuresRef = useScrollReveal();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading label="Curated Selection" title="New Arrivals" />
          <Link to="/shop" className="flex items-center gap-1 text-sm font-medium hover:text-accent hover:gap-2 transition-all duration-300">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? <ProductGridSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Try-On Banner */}
      <section className="container mx-auto px-4 py-16">
        <div
          ref={tryOnRef.ref}
          className={`bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 transition-all duration-1000 ${tryOnRef.visible ? "animate-reveal-scale opacity-100" : "opacity-0 scale-90"}`}
        >
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium animate-float">
              <Sparkles className="w-4 h-4" /> AI Technology
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground bg-gradient-to-r from-primary-foreground via-accent to-primary-foreground bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
              Virtual Try-On
            </h2>
            <p className="text-primary-foreground/70 max-w-md">
              Upload your photo and see how any garment looks on you. Powered by advanced AI for realistic fitting.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_hsl(var(--accent)/0.4)] transition-all duration-300">
              Try Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {products.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className="aspect-[3/4] rounded-lg bg-primary-foreground/10 overflow-hidden hover:scale-105 transition-transform duration-500"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading label="Explore" title="Trending Now" />
          <Link to="/shop" className="flex items-center gap-1 text-sm font-medium hover:text-accent hover:gap-2 transition-all duration-300">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? <ProductGridSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(4, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div
          ref={featuresRef.ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${featuresRef.visible ? "opacity-100" : "opacity-0 translate-y-8"}`}
        >
          {[
            { icon: Sparkles, title: "AI Try-On", desc: "See how clothes look on you before purchasing" },
            { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999 across India" },
            { icon: Shield, title: "Secure Payments", desc: "100% secure checkout with easy returns" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 group"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors duration-300">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
