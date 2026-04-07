import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-semibold mb-4">V Dorbe</h3>
          <p className="text-sm text-primary-foreground/70">Style, Visualized. AI-powered fashion.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <Link to="/shop?gender=Women" className="block hover:text-primary-foreground transition-colors">Women</Link>
            <Link to="/shop?gender=Men" className="block hover:text-primary-foreground transition-colors">Men</Link>
            <Link to="/shop" className="block hover:text-primary-foreground transition-colors">All Products</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <p>Size Guide</p>
            <p>Shipping</p>
            <p>Returns</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Connect</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <p>Instagram</p>
            <p>Twitter</p>
            <p>support@vdorbe.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-xs text-primary-foreground/50">
        © 2026 MODISTA. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
