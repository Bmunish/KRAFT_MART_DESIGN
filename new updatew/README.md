# KraftMart Products Page — Integration Guide

## 📁 Files Included

| File | Purpose |
|------|---------|
| `KraftMart_ProductsPage.tsx` | Main products page with hero, filters, grid, and list view |
| `BackgroundGradientAnimation.tsx` | Reusable animated gradient background component |
| `ProductQuickView.tsx` | Modal for quick product preview |
| `MobileFilterDrawer.tsx` | Slide-out filter panel for mobile |
| `tailwind.config.ts` | Tailwind theme extension with KraftMart colors |
| `globals.css` | Global styles, custom scrollbar, utility classes |

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install framer-motion lucide-react
```

### 2. Update Tailwind Config
Replace or merge your `tailwind.config.ts` with the provided config. The key additions:

```ts
colors: {
  kraft: {
    cream: "#F5F0E8",
    "cream-dark": "#E8E0D5",
    maroon: "#5C1A1B",
    "maroon-dark": "#4a1516",
    gold: "#C4A35A",
    "gold-dark": "#b3924f",
    ink: "#1A1A1A",
  }
}
```

### 3. Add Global Styles
Append the provided CSS to your `globals.css` or create a new `kraftmart.css` and import it.

### 4. Use the Components

```tsx
// app/products/page.tsx or pages/products.tsx
import ProductsPage from "@/components/KraftMart_ProductsPage";

export default function Products() {
  return <ProductsPage />;
}
```

### 5. Connect Real Data
Replace the `products` array in `KraftMart_ProductsPage.tsx` with your API:

```tsx
// Example with fetch
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => setProducts(data));
}, []);
```

## 🎨 Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `kraft-cream` | `#F5F0E8` | Page background |
| `kraft-cream-dark` | `#E8E0D5` | Borders, dividers |
| `kraft-maroon` | `#5C1A1B` | Primary buttons, active states, prices |
| `kraft-maroon-dark` | `#4a1516` | Button hover |
| `kraft-gold` | `#C4A35A` | Accents, badges, stars, labels |
| `kraft-ink` | `#1A1A1A` | Primary text |

## 📱 Responsive Breakpoints

- **Mobile** (< 640px): Single column, drawer filters, stacked layout
- **Tablet** (640–1024px): 2-column grid, sidebar hidden
- **Desktop** (> 1024px): 3-column grid, sticky sidebar, full toolbar

## ✨ Animation Details

| Element | Effect | Duration |
|---------|--------|----------|
| Hero orbs | Float + scale | 15–22s infinite |
| Product cards | Fade up + stagger | 0.5s, 0.08s delay each |
| Card hover | Lift + shadow | 0.5s |
| Image zoom | Scale 1 → 1.1 | 0.7s |
| Quick actions | Slide up + fade | 0.3s |
| Filter drawer | Spring slide | 0.4s |
| Modal | Scale + fade | 0.3s spring |

## 🔧 Customization

### Change Hero Text
```tsx
// In KraftMart_ProductsPage.tsx, find:
<h1 className="...">Our Collection</h1>
// Replace with your heading
```

### Add More Filters
Add new sections to the sidebar using the `FilterSection` component:

```tsx
<FilterSection title="Your Filter">
  {/* Your filter content */}
</FilterSection>
```

### Change Product Images
Replace the `image` URLs in the `products` array with your actual product images.

## 🐛 Common Issues

**Q: Animations not working?**  
A: Ensure `framer-motion` is installed and you're using `"use client"` at the top of components.

**Q: Colors not applying?**  
A: Restart your dev server after updating `tailwind.config.ts`.

**Q: Lucide icons missing?**  
A: Run `npm install lucide-react` and import from `"lucide-react"`.
