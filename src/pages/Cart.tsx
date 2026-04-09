import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState("");

  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shippingCost;

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate("/auth");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    setCheckingOut(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          shipping_address: address.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (orderError || !order) throw orderError || new Error("Failed to create order");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Discover our collection and find something you love.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Shopping Bag ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id + item.size + item.color} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-xl border border-border">
                <Link to={`/product/${item.product.id}`} className="w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg bg-secondary overflow-hidden">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-2" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-medium text-xs sm:text-sm hover:text-accent transition-colors line-clamp-2">{item.product.name}</Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-sm">₹{item.product.price.toLocaleString()}</p>
                    <p className="font-semibold text-sm sm:hidden">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-secondary transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-secondary transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-sm hidden sm:block">₹{(item.product.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-1.5 block">Shipping Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full shipping address..."
                  className="w-full p-3 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full mt-4 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {checkingOut ? "Placing Order..." : "Place Order"}
              </button>

              <Link to="/orders" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-3 transition-colors">
                View My Orders →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
