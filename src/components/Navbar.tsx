import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/" className="font-display text-xl md:text-2xl font-semibold tracking-tight">
          MODISTA
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <Link to="/shop?gender=Women" className="hover:text-accent transition-colors">Women</Link>
          <Link to="/shop?gender=Men" className="hover:text-accent transition-colors">Men</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/shop" className="hover:text-accent transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <Link to="/wishlist" className="relative hover:text-accent transition-colors">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative hover:text-accent transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="hover:text-accent transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-up">
          <div className="flex flex-col p-4 gap-3 text-sm font-medium uppercase tracking-wide">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link to="/shop?gender=Women" onClick={() => setMobileOpen(false)}>Women</Link>
            <Link to="/shop?gender=Men" onClick={() => setMobileOpen(false)}>Men</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
