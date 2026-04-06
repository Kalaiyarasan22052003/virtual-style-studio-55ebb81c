import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Fashion models walking in urban setting"
          className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${loaded ? "scale-100" : "scale-110"}`}
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36 lg:py-44">
        <div className="max-w-xl space-y-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Virtual Try-On</span>
          </div>

          <h1
            className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Fashion Meets
            <br />
            <span className="italic bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>

          <p
            className={`text-primary-foreground/80 text-lg max-w-md transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Try before you buy. Our AI lets you see how every piece looks on you — no fitting room needed.
          </p>

          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-lg border border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" /> Try Virtual Fitting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
