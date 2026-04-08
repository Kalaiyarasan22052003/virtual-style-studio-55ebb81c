import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <footer ref={ref} className="bg-primary text-primary-foreground mt-20">
      <div className={`container mx-auto px-4 py-12 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-1 bg-gradient-to-r from-accent via-accent/80 to-gold bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
              V Dorbe
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/50 mb-3">Style, Visualized</p>
            <p className="text-sm text-primary-foreground/70">AI-powered fashion. Try before you buy.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <Link to="/shop?gender=Women" className="block hover:text-primary-foreground hover:translate-x-1 transition-all duration-300">Women</Link>
              <Link to="/shop?gender=Men" className="block hover:text-primary-foreground hover:translate-x-1 transition-all duration-300">Men</Link>
              <Link to="/shop" className="block hover:text-primary-foreground hover:translate-x-1 transition-all duration-300">All Products</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p className="hover:text-primary-foreground transition-colors duration-300 cursor-pointer">Size Guide</p>
              <p className="hover:text-primary-foreground transition-colors duration-300 cursor-pointer">Shipping</p>
              <p className="hover:text-primary-foreground transition-colors duration-300 cursor-pointer">Returns</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p className="hover:text-primary-foreground transition-colors duration-300 cursor-pointer">Instagram</p>
              <p className="hover:text-primary-foreground transition-colors duration-300 cursor-pointer">Twitter</p>
              <p>support@vdorbe.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-xs text-primary-foreground/50">
          © 2026 V Dorbe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
