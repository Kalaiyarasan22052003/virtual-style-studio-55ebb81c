import { TrendingUp, Package, Star, DollarSign, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number | null;
  review_count: number | null;
}

const COLORS = ["hsl(24, 80%, 55%)", "hsl(220, 30%, 25%)", "hsl(42, 78%, 60%)", "hsl(150, 15%, 65%)", "hsl(350, 30%, 85%)"];

const SellerAnalytics = ({ products }: { products: Product[] }) => {
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const avgRating = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.filter((p) => p.rating).length).toFixed(1)
    : "—";
  const totalReviews = products.reduce((s, p) => s + (p.review_count || 0), 0);

  const categoryData = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const stockData = products
    .slice(0, 8)
    .map((p) => ({ name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name, stock: p.stock, price: p.price }));

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-accent" },
    { label: "Total Stock", value: totalStock.toLocaleString(), icon: TrendingUp, color: "text-sage" },
    { label: "Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-gold" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <p className="font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock by product */}
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="font-display text-lg font-semibold mb-4">Stock Levels</h3>
          {stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(40, 33%, 98%)",
                    border: "1px solid hsl(30, 15%, 90%)",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="stock" fill="hsl(24, 80%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No product data</p>
          )}
        </div>

        {/* Category distribution */}
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="font-display text-lg font-semibold mb-4">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No category data</p>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="p-6 bg-card rounded-xl border border-border">
        <h3 className="font-display text-lg font-semibold mb-4">Product Performance</h3>
        <div className="space-y-3">
          {products
            .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
            .slice(0, 5)
            .map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-gold text-gold" />
                  {p.rating || "—"}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {p.review_count || 0} reviews
                </div>
                <p className="text-sm font-semibold">₹{p.price.toLocaleString()}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
