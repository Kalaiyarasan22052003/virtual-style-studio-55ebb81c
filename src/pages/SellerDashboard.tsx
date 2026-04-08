import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerProductList from "@/components/seller/SellerProductList";
import SellerProductForm from "@/components/seller/SellerProductForm";
import SellerAnalytics from "@/components/seller/SellerAnalytics";
import { Package, BarChart3, PlusCircle, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";

type Tab = "products" | "add" | "analytics";

const SellerDashboard = () => {
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const { data: products = [], refetch } = useQuery({
    queryKey: ["seller-products", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!hasRole("seller") && !hasRole("admin")) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Seller Access Required</h2>
          <p className="text-muted-foreground mb-6">You need a seller account to access this dashboard. Contact an admin to get seller privileges.</p>
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setActiveTab("add");
  };

  const handleFormDone = () => {
    setEditingProductId(null);
    setActiveTab("products");
    refetch();
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "products", label: "My Products", icon: Package },
    { id: "add", label: editingProductId ? "Edit Product" : "Add Product", icon: PlusCircle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Seller Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">{products.length} products listed</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              <Users className="w-4 h-4" /> Switch to Buyer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto scrollbar-hide">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (id !== "add") setEditingProductId(null);
                setActiveTab(id);
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{id === "add" ? (editingProductId ? "Edit" : "Add") : id === "products" ? "Products" : "Stats"}</span>
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <SellerProductList products={products} onEdit={handleEdit} onRefresh={refetch} />
        )}
        {activeTab === "add" && (
          <SellerProductForm
            editProductId={editingProductId}
            onDone={handleFormDone}
          />
        )}
        {activeTab === "analytics" && <SellerAnalytics products={products} />}
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
