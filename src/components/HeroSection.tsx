import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Fashion collection" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36 lg:py-44">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Virtual Try-On</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Fashion Meets
            <br />
            <span className="italic">Intelligence</span>
          </h1>

          <p className="text-primary-foreground/80 text-lg max-w-md">
            Try before you buy. Our AI lets you see how every piece looks on you — no fitting room needed.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-lg border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
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
