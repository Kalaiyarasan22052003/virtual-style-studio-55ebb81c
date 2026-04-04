import girlsShirt from "@/assets/products/girls_shirt.png";
import denimGirl from "@/assets/products/denim_girl.png";
import gown from "@/assets/products/gown.png";
import shirt from "@/assets/products/shirt.png";
import jean from "@/assets/products/jean.png";
import dress3 from "@/assets/products/dress3.png";
import coat from "@/assets/products/coat.png";
import hoodie from "@/assets/products/hoodie.png";
import dress2 from "@/assets/products/dress_2.png";
import dress from "@/assets/products/dress.png";

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

export const products: Product[] = [
  {
    id: "1",
    name: "Light Blue Women Top",
    category: "Tops",
    subcategory: "Women > Tops",
    gender: "Women",
    price: 899,
    tags: ["casual", "summer", "soft fabric"],
    tryOnEnabled: true,
    image: girlsShirt,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "White", "Pink"],
    stock: 45,
    rating: 4.3,
    reviewCount: 128,
    seller: "StyleCraft",
    description: "A delicate light blue top with feminine bell sleeves and a cinched waist. Perfect for casual summer outings.",
  },
  {
    id: "2",
    name: "Women Denim Jacket",
    category: "Jackets",
    subcategory: "Women > Jackets",
    gender: "Women",
    price: 1999,
    tags: ["denim", "winter", "stylish"],
    tryOnEnabled: true,
    image: denimGirl,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue"],
    stock: 30,
    rating: 4.6,
    reviewCount: 89,
    seller: "DenimWorld",
    description: "Classic light-wash denim jacket with copper button detailing. A timeless wardrobe essential.",
  },
  {
    id: "3",
    name: "Purple Midi Dress",
    category: "Dresses",
    subcategory: "Women > Dresses",
    gender: "Women",
    price: 1499,
    tags: ["party", "elegant"],
    tryOnEnabled: true,
    image: gown,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Purple", "Navy", "Black"],
    stock: 22,
    rating: 4.5,
    reviewCount: 67,
    seller: "EleganceHub",
    description: "Elegant pleated midi dress in deep purple. Features a flattering scoop neckline and 3/4 sleeves.",
  },
  {
    id: "4",
    name: "White Formal Shirt",
    category: "Shirts",
    subcategory: "Men > Shirts",
    gender: "Men",
    price: 1299,
    tags: ["office", "formal"],
    tryOnEnabled: true,
    image: shirt,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Light Blue", "Ivory"],
    stock: 60,
    rating: 4.4,
    reviewCount: 203,
    seller: "FormalEdge",
    description: "Crisp white formal shirt with a classic collar. Premium cotton fabric for all-day comfort.",
  },
  {
    id: "5",
    name: "Dark Denim Jacket",
    category: "Jackets",
    subcategory: "Men > Jackets",
    gender: "Men",
    price: 2499,
    tags: ["winter", "rugged"],
    tryOnEnabled: true,
    image: jean,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Dark Blue", "Black"],
    stock: 25,
    rating: 4.7,
    reviewCount: 156,
    seller: "UrbanRider",
    description: "Rugged dark-wash denim jacket with vintage distressing. Built for durability and style.",
  },
  {
    id: "6",
    name: "Designer Purple Gown",
    category: "Party Wear",
    subcategory: "Women > Party Wear",
    gender: "Women",
    price: 3999,
    tags: ["wedding", "luxury"],
    tryOnEnabled: true,
    image: dress3,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Purple", "Burgundy"],
    stock: 12,
    rating: 4.9,
    reviewCount: 34,
    seller: "LuxeDesigns",
    description: "Showstopping designer gown with cascading ruffles and crystal embellishments. Perfect for weddings and galas.",
  },
  {
    id: "7",
    name: "Formal Blazer",
    category: "Blazers",
    subcategory: "Men > Blazers",
    gender: "Men",
    price: 3499,
    tags: ["office", "premium"],
    tryOnEnabled: true,
    image: coat,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Charcoal", "Black"],
    stock: 18,
    rating: 4.6,
    reviewCount: 91,
    seller: "SuitMaster",
    description: "Tailored slim-fit blazer in premium navy fabric. Single-button closure with notch lapels.",
  },
  {
    id: "8",
    name: "Black Hoodie",
    category: "Hoodies",
    subcategory: "Unisex > Hoodies",
    gender: "Unisex",
    price: 1199,
    tags: ["winter", "casual"],
    tryOnEnabled: true,
    image: hoodie,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    stock: 80,
    rating: 4.2,
    reviewCount: 312,
    seller: "ComfortZone",
    description: "Essential black pullover hoodie with kangaroo pocket. Soft fleece interior for maximum comfort.",
  },
  {
    id: "9",
    name: "Striped Stylish Top",
    category: "Tops",
    subcategory: "Women > Tops",
    gender: "Women",
    price: 999,
    tags: ["trendy", "fashion"],
    tryOnEnabled: true,
    image: dress2,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy/Red", "Black/White"],
    stock: 35,
    rating: 4.1,
    reviewCount: 76,
    seller: "TrendSetters",
    description: "Bold striped top with a mock neck and tie-waist detail. A statement piece for any outfit.",
  },
  {
    id: "10",
    name: "Floral Designer Dress",
    category: "Dresses",
    subcategory: "Women > Dresses",
    gender: "Women",
    price: 1799,
    tags: ["floral", "summer"],
    tryOnEnabled: true,
    image: dress,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White/Floral", "Blue/Floral"],
    stock: 20,
    rating: 4.8,
    reviewCount: 54,
    seller: "FloralChic",
    description: "Asymmetric designer dress with botanical print and contrasting green sash. Artisanal craftsmanship.",
  },
];

export const categories = [
  { label: "All", value: "all" },
  { label: "Tops", value: "Tops" },
  { label: "Jackets", value: "Jackets" },
  { label: "Dresses", value: "Dresses" },
  { label: "Shirts", value: "Shirts" },
  { label: "Party Wear", value: "Party Wear" },
  { label: "Blazers", value: "Blazers" },
  { label: "Hoodies", value: "Hoodies" },
];

export const genders = ["All", "Women", "Men", "Unisex"];
