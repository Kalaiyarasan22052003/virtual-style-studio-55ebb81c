# MODISTA — AI-Powered Fashion E-Commerce

A full-stack fashion marketplace with AI virtual try-on, role-based access (Buyer / Seller / Admin), and real-time product management.

## ✨ Features

- **Product Catalog** — 10+ preloaded fashion items with filters by category, gender, price & search
- **AI Virtual Try-On** — Upload your photo and see yourself wearing any garment, powered by Gemini image generation
- **Authentication** — Email/password, Google & Apple OAuth with automatic role assignment
- **Role-Based Access**
  - **Buyer** — Browse, wishlist, cart, checkout, reviews, virtual try-on
  - **Seller** — Product CRUD, image uploads, sales analytics dashboard
  - **Admin** — Full platform management
- **Cart & Wishlist** — Persistent across sessions via database
- **Seller Dashboard** — Add/edit products, upload images, view stock & category analytics
- **Responsive Design** — Mobile-first UI built with Tailwind CSS

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| State | React Context, TanStack React Query |
| Backend | Lovable Cloud (Supabase) — Postgres, Auth, Storage, Edge Functions |
| AI | Lovable AI Gateway → Google Gemini 3.1 Flash Image Preview |
| Charts | Recharts |
| Routing | React Router v6 |

## 📁 Project Structure

```
src/
├── assets/products/     # Product images
├── components/
│   ├── seller/          # Seller dashboard components
│   ├── ui/              # shadcn/ui primitives
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── TryOnModal.tsx
├── contexts/
│   ├── AuthContext.tsx   # Auth state & role management
│   └── CartContext.tsx   # Cart state
├── data/products.ts     # Static product data (fallback)
├── pages/
│   ├── Auth.tsx          # Login / Sign-up
│   ├── Cart.tsx
│   ├── Index.tsx         # Homepage
│   ├── ProductDetail.tsx
│   ├── SellerDashboard.tsx
│   ├── Shop.tsx
│   └── Wishlist.tsx
└── integrations/supabase/

supabase/
├── functions/
│   └── virtual-try-on/  # AI try-on edge function
├── migrations/          # Database schema & seed data
└── config.toml
```

## 🗄 Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User display name, avatar, phone, address, preferences |
| `user_roles` | Role assignments (admin / seller / buyer) |
| `products` | Full product catalog |
| `orders` | Order headers |
| `order_items` | Line items per order |
| `cart_items` | Persistent cart |
| `wishlist_items` | Saved items |
| `reviews` | Product ratings & comments |
| `try_on_results` | AI try-on history |

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open `http://localhost:5173`

## 📄 License

Private — All rights reserved.
