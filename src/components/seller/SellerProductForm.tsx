import { useState, useEffect, useRef } from "react";
import { Upload, X, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CATEGORIES = ["Tops", "Jackets", "Dresses", "Shirts", "T-Shirts", "Party Wear", "Blazers", "Hoodies"];
const GENDERS = ["Women", "Men", "Unisex"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

interface Props {
  editProductId: string | null;
  onDone: () => void;
}

const SellerProductForm = ({ editProductId, onDone }: Props) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Tops",
    subcategory: "",
    gender: "Women",
    price: "",
    tags: "",
    sizes: ["S", "M", "L", "XL"],
    colors: "",
    stock: "",
    image_url: "",
    try_on_enabled: true,
  });

  // Load product data for editing
  useEffect(() => {
    if (!editProductId) return;
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("id", editProductId).single();
      if (data) {
        setForm({
          name: data.name,
          description: data.description || "",
          category: data.category,
          subcategory: data.subcategory || "",
          gender: data.gender,
          price: String(data.price),
          tags: (data.tags || []).join(", "),
          sizes: data.sizes || ["S", "M", "L", "XL"],
          colors: (data.colors || []).join(", "),
          stock: String(data.stock),
          image_url: data.image_url || "",
          try_on_enabled: data.try_on_enabled ?? true,
        });
      }
    })();
  }, [editProductId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill in name, price, and stock");
      return;
    }

    setLoading(true);
    const productData = {
      name: form.name,
      description: form.description || null,
      category: form.category,
      subcategory: form.subcategory || `${form.gender} > ${form.category}`,
      gender: form.gender,
      price: parseFloat(form.price),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      sizes: form.sizes,
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
      stock: parseInt(form.stock),
      image_url: form.image_url || null,
      try_on_enabled: form.try_on_enabled,
      seller_id: user.id,
    };

    try {
      if (editProductId) {
        const { error } = await supabase.from("products").update(productData).eq("id", editProductId);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Product added!");
      }
      onDone();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl font-semibold">
        {editProductId ? "Edit Product" : "Add New Product"}
      </h2>

      {/* Image upload */}
      <div>
        <label className="text-sm font-medium mb-2 block">Product Image</label>
        <div className="flex items-start gap-4">
          <div
            className="w-32 h-40 rounded-lg bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : form.image_url ? (
              <img src={form.image_url} alt="Product" className="w-full h-full object-contain p-2" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Upload</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {form.image_url && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
              className="mt-1 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium mb-1 block">Product Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="e.g., Classic White Shirt"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          placeholder="Describe your product..."
        />
      </div>

      {/* Category + Gender row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Gender *</label>
          <select
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price + Stock row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Price (₹) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
            min={1}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="999"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Stock *</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            required
            min={0}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="50"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`w-12 h-10 rounded-lg border text-xs font-medium transition-colors ${
                form.sizes.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-foreground/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="text-sm font-medium mb-1 block">Colors (comma-separated)</label>
        <input
          type="text"
          value={form.colors}
          onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="Black, White, Navy"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="casual, summer, trendy"
        />
      </div>

      {/* Try-on toggle */}
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
        <Sparkles className="w-5 h-5 text-accent" />
        <div className="flex-1">
          <p className="text-sm font-medium">Virtual Try-On</p>
          <p className="text-xs text-muted-foreground">Allow buyers to try this product using AI</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, try_on_enabled: !f.try_on_enabled }))}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            form.try_on_enabled ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${
              form.try_on_enabled ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Saving..." : editProductId ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SellerProductForm;
