import { Trash2, Pencil, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  stock: number;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  try_on_enabled: boolean | null;
  created_at: string;
}

interface Props {
  products: Product[];
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

const SellerProductList = ({ products, onEdit, onRefresh }: Props) => {
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      onRefresh();
    }
  };

  const toggleTryOn = async (id: string, current: boolean | null) => {
    const { error } = await supabase.from("products").update({ try_on_enabled: !current }).eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(`Try-On ${!current ? "enabled" : "disabled"}`);
      onRefresh();
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Price</div>
        <div className="col-span-1">Stock</div>
        <div className="col-span-1">Rating</div>
        <div className="col-span-1">Try-On</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-card rounded-xl border border-border hover:shadow-product transition-shadow"
        >
          {/* Product info */}
          <div className="col-span-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.gender}</p>
            </div>
          </div>

          <div className="col-span-2 text-sm text-muted-foreground">{product.category}</div>
          <div className="col-span-1 text-sm font-medium">₹{product.price.toLocaleString()}</div>
          <div className="col-span-1">
            <span className={`text-sm ${product.stock < 10 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              {product.stock}
            </span>
          </div>
          <div className="col-span-1 text-sm text-muted-foreground">
            {product.rating ? `${product.rating} ★` : "—"}
          </div>
          <div className="col-span-1">
            <button
              onClick={() => toggleTryOn(product.id, product.try_on_enabled)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                product.try_on_enabled
                  ? "bg-accent/10 text-accent"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {product.try_on_enabled ? "On" : "Off"}
            </button>
          </div>
          <div className="col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(product.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary hover:bg-muted transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(product.id, product.name)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerProductList;
