import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  gender: "Women" | "Men" | "Unisex";
  price: number;
  tags: string[];
  tryOnEnabled: boolean;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  seller: string;
  description: string;
}

function mapDbProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory || "",
    gender: row.gender as Product["gender"],
    price: Number(row.price),
    tags: row.tags || [],
    tryOnEnabled: row.try_on_enabled ?? false,
    image: row.image_url || "/placeholder.svg",
    sizes: row.sizes || [],
    colors: row.colors || [],
    stock: row.stock ?? 0,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    seller: row.seller_id || "V Dorbe",
    description: row.description || "",
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDbProduct);
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapDbProduct(data) : null;
    },
    enabled: !!id,
  });
}
