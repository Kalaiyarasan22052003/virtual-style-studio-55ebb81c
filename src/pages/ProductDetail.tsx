import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Sparkles, Star, Truck, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TryOnModal from "@/components/TryOnModal";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showTryOn, setShowTryOn] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/shop" className="text-accent mt-4 inline-block">Back to shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-[3/4] rounded-xl bg-secondary overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1">{product.subcategory}</p>
              <h1 className="font-display text-3xl font-semibold">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-sm text-muted-foreground">by {product.seller}</span>
              </div>
            </div>

            <p className="font-display text-3xl font-bold">₹{product.price.toLocaleString()}</p>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size */}
            <div>
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-foreground/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedColor === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-foreground/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 flex items-center justify-center rounded-lg border transition-colors ${
                  isInWishlist(product.id) ? "bg-accent/10 border-accent text-accent" : "border-border hover:border-foreground/30"
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-accent" : ""}`} />
              </button>
            </div>

            {/* Try On */}
            {product.tryOnEnabled && (
              <button
                onClick={() => setShowTryOn(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4" /> Virtual Try-On
              </button>
            )}

            {/* Info badges */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" /> Free shipping above ₹999
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="w-4 h-4" /> 7-day easy returns
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Stock */}
            <p className={`text-sm ${product.stock < 20 ? "text-destructive" : "text-muted-foreground"}`}>
              {product.stock < 20 ? `Only ${product.stock} left in stock` : "In Stock"}
            </p>
          </div>
        </div>
      </div>

      {showTryOn && <TryOnModal product={product} onClose={() => setShowTryOn(false)} />}
      <Footer />
    </div>
  );
};

export default ProductDetail;
