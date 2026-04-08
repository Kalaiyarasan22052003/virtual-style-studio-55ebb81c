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
    <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Fashion models walking in urban setting"
          className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${loaded ? "scale-100" : "scale-110"}`}
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/20" />
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:py-24 md:py-36 lg:py-44">
        <div className="max-w-2xl space-y-5 sm:space-y-8">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 backdrop-blur-md border border-accent/25 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground tracking-wide">AI-Powered Virtual Try-On</span>
          </div>

          {/* Brand name with animated reveal */}
          <div className={`transition-all duration-1000 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.9] tracking-tight">
              <span className="inline-block animate-[text-glow_3s_ease-in-out_infinite] bg-gradient-to-r from-primary-foreground via-accent to-primary-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
                V Dorbe
              </span>
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className={`h-px bg-gradient-to-r from-accent to-transparent transition-all duration-1000 delay-500 ${loaded ? "w-16" : "w-0"}`} />
              <p className={`text-sm md:text-base uppercase tracking-[0.4em] text-accent font-medium transition-all duration-700 delay-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
                Style, Visualized
              </p>
            </div>
          </div>

          {/* Headline */}
          <h2
            className={`font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Fashion Meets{" "}
            <span className="italic bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>

          <p
            className={`text-primary-foreground/75 text-lg md:text-xl max-w-lg leading-relaxed transition-all duration-700 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Try before you buy. Our AI lets you see how every piece looks on you — no fitting room needed.
          </p>

          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-[600ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--accent)/0.4)] transition-all duration-300"
            >
              Shop Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-lg border border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin" /> Try Virtual Fitting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
