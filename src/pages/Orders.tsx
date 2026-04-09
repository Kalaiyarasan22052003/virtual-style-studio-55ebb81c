import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, MapPin, Ban } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  product?: { name: string; image_url: string | null };
}

interface Order {
  id: string;
  status: string;
  total: number;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; step: number }> = {
  pending: { icon: Clock, label: "Order Placed", color: "text-yellow-500", step: 1 },
  confirmed: { icon: Package, label: "Confirmed", color: "text-blue-500", step: 2 },
  shipped: { icon: Truck, label: "Shipped", color: "text-purple-500", step: 3 },
  delivered: { icon: CheckCircle, label: "Delivered", color: "text-green-500", step: 4 },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-destructive", step: 0 },
};

const trackingSteps = ["pending", "confirmed", "shipped", "delivered"];

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !ordersData) {
        setLoading(false);
        return;
      }

      const ordersWithItems: Order[] = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);

          const enrichedItems = await Promise.all(
            (items || []).map(async (item) => {
              const { data: product } = await supabase
                .from("products")
                .select("name, image_url")
                .eq("id", item.product_id)
                .maybeSingle();
              return { ...item, product: product || undefined };
            })
          );

          return { ...order, items: enrichedItems };
        })
      );

      setOrders(ordersWithItems);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const cancelOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to cancel order");
      return;
    }
    toast.success("Order cancelled successfully");
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Sign in to view orders</h2>
          <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg mt-4">
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to place your first order!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
            Shop Now
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
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const currentStep = config.step;
            const canCancel = order.status === "pending" || order.status === "confirmed";

            return (
              <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </span>
                    {canCancel && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Ban className="w-3 h-3" /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracking Progress */}
                {order.status !== "cancelled" && (
                  <div className="px-4 sm:px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-3 left-0 right-0 h-0.5 bg-border" />
                      <div
                        className="absolute top-3 left-0 h-0.5 bg-primary transition-all duration-500"
                        style={{ width: `${Math.max(0, ((currentStep - 1) / 3) * 100)}%` }}
                      />
                      {trackingSteps.map((step, i) => {
                        const stepConfig = statusConfig[step];
                        const StepIcon = stepConfig.icon;
                        const isActive = currentStep >= stepConfig.step;
                        return (
                          <div key={step} className="relative flex flex-col items-center z-10">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <StepIcon className="w-3 h-3" />
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-1.5 ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {stepConfig.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="p-4 sm:p-6 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                        {item.product?.image_url && (
                          <img src={item.product.image_url} alt={item.product?.name} className="w-full h-full object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product?.name || "Product"}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 bg-muted/30 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {order.shipping_address && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {order.shipping_address}
                    </p>
                  )}
                  <p className="text-sm font-semibold ml-auto">Total: ₹{Number(order.total).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
