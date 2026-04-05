import { Link } from "react-router-dom";
import { Heart, Sparkles, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/hooks/useProducts";

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="group relative animate-fade-up">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.tryOnEnabled && (
            <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              <Sparkles className="w-3 h-3" /> Try On
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
      </button>

      <Link to={`/product/${product.id}`} className="block mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.gender} · {product.category}</p>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">₹{product.price.toLocaleString()}</span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-gold text-gold" /> {product.rating}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
