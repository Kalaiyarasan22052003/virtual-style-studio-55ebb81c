import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const { user, profile, signOut, hasRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

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
          {hasRole("admin") && (
            <Link to="/admin" className="hover:text-accent transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
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

          {/* User menu */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm hover:bg-accent/20 transition-colors"
                >
                  {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 w-56 bg-background border border-border rounded-lg shadow-elevated animate-fade-up z-50">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{profile?.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                        My Orders
                      </Link>
                      {hasRole("seller") && (
                        <Link to="/seller" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                          Seller Dashboard
                        </Link>
                      )}
                      {hasRole("admin") && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary text-destructive transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/auth" className="hover:text-accent transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-up">
          <div className="flex flex-col p-4 gap-3 text-sm font-medium uppercase tracking-wide">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link to="/shop?gender=Women" onClick={() => setMobileOpen(false)}>Women</Link>
            <Link to="/shop?gender=Men" onClick={() => setMobileOpen(false)}>Men</Link>
            {!user && <Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link>}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
