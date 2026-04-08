import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { label: "All", value: "all" },
  { label: "Tops", value: "Tops" },
  { label: "Jackets", value: "Jackets" },
  { label: "Dresses", value: "Dresses" },
  { label: "Shirts", value: "Shirts" },
  { label: "Party Wear", value: "Party Wear" },
  { label: "Blazers", value: "Blazers" },
  { label: "Hoodies", value: "Hoodies" },
  { label: "T-Shirts", value: "T-Shirts" },
];

const genders = ["All", "Women", "Men", "Unisex"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialGender = searchParams.get("gender") || "All";

  const { data: products = [], isLoading } = useProducts();
  const { ref: titleRef, visible: titleVisible } = useScrollReveal();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [gender, setGender] = useState(initialGender);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      const matchGender = gender === "All" || p.gender === gender;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchCategory && matchGender && matchPrice;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, search, category, gender, priceRange, sortBy]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div
          ref={titleRef}
          className={`flex items-center justify-between mb-6 transition-all duration-700 ${titleVisible ? "animate-reveal-left opacity-100" : "opacity-0 -translate-x-8"}`}
        >
          <h1 className="font-display text-3xl font-semibold bg-gradient-to-r from-foreground to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
            Shop
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, tags, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow duration-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter toggle on mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 mb-4 bg-secondary rounded-lg text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0 space-y-6`}>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 hover:scale-105 ${
                      category === c.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-accent hover:text-accent"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 hover:scale-105 ${
                      gender === g
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-accent hover:text-accent"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Price Range</p>
              <div className="flex items-center gap-2 text-sm">
                <span>₹{priceRange[0]}</span>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="flex-1 accent-accent"
                />
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Sort By</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
