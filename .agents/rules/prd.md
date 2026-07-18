---
trigger: always_on
---

# 🌟 AI Prompt: Food Products Store (Storefront & Admin Dashboard)

## 1. 🌟 Project Overview
📋 **Project Name**: Foodie Store & Admin Panel
🎯 **Objective**: Build a complete e-commerce platform for food products containing a storefront for customers and an admin dashboard for management in a single-page application (SPA).
👥 **Users**:
- **Customers (Shoppers)**: Browsing food products, managing cart, checking out.
- **Admins**: Managing catalog (products, variants, packages), orders, and user permissions.

## 2. 💻 Technical Details
🔧 **Technologies Used**:
- **Languages**: TypeScript, JavaScript
- **Frontend Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (v4), Shadcn UI
- **State Management & Data Fetching**: React Context (Auth, Cart) & React Query (TanStack Query) 
- **Routing**: React Router DOM (v7+)

## 3. 📁 Project Structure

```text
src/app/
├── i18n/
│   ├── config.ts
│   ├── direction.ts
│   └── locales/
├── routes/
│   └── router.store.tsx
│
├── components/
│   ├── client/
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── CategoryShowcase.tsx
│   │   │   └── PromoSection.tsx
│   │   │
│   │   ├── category/
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   └── CategoryBreadcrumb.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── MaterialSelector.tsx
│   │   │   ├── StockBadge.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── RelatedProducts.tsx
│   │   │
│   │   ├── seo/
│   │   │   ├── SEO.tsx
│   │   │   ├── ProductSchema.tsx
│   │   │   ├── BreadcrumbSchema.tsx
│   │   │   └── MetaTags.tsx
│   │   │
│   │   ├── security/
│   │   │   ├── auth.guard.ts
│   │   │   ├── permissions.ts
│   │   │   ├── sanitize.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── wishlist/
│   │   │   ├── WishlistButton.tsx
│   │   │   ├── WishlistItem.tsx
│   │   │   └── WishlistGrid.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   └── EmptyCart.tsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ShippingDetails.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── PaymentMethodSelector.tsx
│   │   │
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   └── OrderFilters.tsx
│   │   │
│   │   ├── review/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── ReviewFilters.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── ResetPasswordForm.tsx
│   │   │   ├── VerifyOTPForm.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── PaymentGateway.tsx
│   │   │   ├── PaymentSuccess.tsx
│   │   │   └── PaymentFailed.tsx
│   │   │
│   │   ├── account/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ChangePassword.tsx
│   │   │   ├── AddressManager.tsx
│   │   │   └── AccountSidebar.tsx
│   │   │
│   │   └── package/
│   │       ├── PackageCard.tsx
│   │       ├── PackageGrid.tsx
│   │       └── PackageDetails.tsx
│   │
│   └── shared/
│       └── ui/
│
├── pages/
│   └── client/
│       ├── HomePage.tsx
│       ├── ShopPage.tsx
│       ├── ProductPage.tsx
│       ├── CategoryPage.tsx
│       ├── CartPage.tsx
│       ├── WishlistPage.tsx
│       ├── CheckoutPage.tsx
│       ├── OrdersPage.tsx
│       ├── OrderDetailsPage.tsx
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       └── NotFoundPage.tsx
│
├── lib/
│   ├── api-client.ts
│   ├── axios.ts
│   ├── utils.ts
│   └── constants.ts
│
└── main.tsx
```

## 4. 🔗 Routes and Links

**Web Routes (Storefront)**:
```yaml
### Storefront (Public)
/                          # Home page (Featured products, categories, promos)
/shop                      # Product catalog with filters & sorting
/shop/category/:categoryId # Products filtered by category
/product/:id               # Product details (variants, gallery, reviews)
/wishlist                  # Saved products (Protected)
/cart                      # Cart drawer/page (view & edit items)
/checkout                  # Shipping details & order summary (Protected)
/orders                    # Order history (Protected)
/orders/:id                # Order details & status (Protected)
/login                     # User Login
/register                  # User Registration
*                          # 404 Not Found
/account                    # بيانات المستخدم (username, email) - Protected

```
 

## 5. 🗄️ Database Schema & Interfaces Study
تمت دراسة قاعدة البيانات (Prisma) بشكل دقيق لبناء واجهات توافق العمليات التجارية للمتجر الغذائي:

1. **إدارة المستخدمين والصلاحيات (Users & Roles)**
   - النماذج: `User`, `Policy`, `Permission`
   - واجهات الإدارة (`admin`): إدارة المستخدمين، وتعيين السياسات (Policies) والصلاحيات لدخول لوحة التحكم.

2. **الكتالوج والمنتجات (Catalog Management)**
   - النماذج: `Category`, `Product`, `ProductVariant`, `Size`, `Material`, `ProductVariantImage`
   - واجهات المتجر (`store`): تصفح المنتجات وفلترتها وعرض تفاصيل كل "متغير" (Variant) حسب الحجم أو المادة.
   - واجهات الإدارة (`admin`): شاشات متقدمة لإضافة منتج أساسي، ثم ربطه بعدة متغيرات (بأسعار وكميات مخزون مختلفة)، وإدارة صور كل متغير.

3. **المبيعات والسلة (Sales & Cart)**
   - النماذج: `Cart`, `CartItem`, `Checkout`, `Order`
   - واجهات المتجر (`store`): نظام السلة، إضافة عناصر، والذهاب لصفحة الـ Checkout لتسجيل تفاصيل الشحن (الاسم، العنوان).
   - واجهات الإدارة (`admin`): تتبع الطلبات (Orders) عبر لوحة التحكم وتغيير حالاتها (Pending, Shipped)، ومراجعة تفاصيل الشحن.

4. **المبيعات بالجملة والعروض (Packages)**
   - النماذج: `ProductVariantPackage`, `VariantPackage`
   - نظام متقدم يسمح للإدارة بإنشاء عروض أو باقات تسعير خاصة عند شراء كميات، وهو ما يتطلب واجهة مخصصة في الإدارة لتكوين الباقات، وواجهة واضحة في المتجر لإغراء العميل بشرائها.

5. **التفاعل (Engagement)**
   - النماذج: `WishList`, `Review`
   - المستخدم يمكنه تقييم متغير المنتج وإضافته للمفضلة. الإدارة يمكنها مراقبة التقييمات.## 6. 📏 Standards to Follow (Directed Commands)
- **Use TypeScript**: Strictly type all React components, context providers, and data models to ensure type safety.
- **Component Architecture**: Use Shadcn UI for foundational blocks. Keep complex UI components separated and modular.
- **Data Fetching**: Use `@tanstack/react-query` exclusively for server state. Avoid using `useEffect` for data fetching.
- **Styling**: Adhere to Tailwind CSS v4 patterns. Avoid inline styles. Use `cn` from `src/lib/utils.ts` for class merging.
- **Naming Conventions**: Use `camelCase` for variables and functions, and `PascalCase` for React components.

## 7. 🚀 Footer (Final Command)
- **Check the AI Prompt file**: Ensure all instructions, architecture, and context are clear.
- **Instructions for building the project**: Start implementing the API integration layer using React Query to connect the Prisma backend with the frontend components.
- **Wait for me in the next responses**: Please review this plan, and wait for my explicit confirmation before writing any functional code.
# Engineering Rules

## UI / UX
- Use Skeleton Loading for all async content
- Use Shadcn UI as the primary UI component library
- Follow Design System rules (tokens, spacing, typography, colors)
- Keep UI samples documented in design documentation
- Follow UX Writing principles
- All messages, errors, empty states, and notifications must be user-friendly
- Support responsive design (Mobile / Tablet / Desktop)
- Support RTL/LTR direction
- Use accessible components (ARIA, keyboard navigation)
- Follow WCAG accessibility guidelines
- Use consistent loading, error, and empty states


## API & Data Management
- Use centralized api-client only
- Do not call APIs directly inside UI components
- Separate API services from components
- Use React Query for server state management
- Implement caching and invalidation strategies
- Handle API errors globally
- Use request/response interceptors
- Normalize API responses
- Use TypeScript types for all API responses


## State Management
- Separate server state from client state
- Use Zustand/Redux Toolkit for global client state
- Avoid unnecessary global states
- Keep feature states isolated


## Forms & Validation
- Use React Hook Form for forms
- Use Zod for schema validation
- Validate all user inputs
- Provide clear validation messages
- Prevent invalid submissions


## Internationalization
- Support Arabic and English
- Support RTL/LTR automatically
- Store all text in translation files
- No hardcoded text inside components
- Support date, number, and currency localization


## Performance
- Use Lazy Loading for routes and heavy components
- Use React Suspense
- Optimize images
- Use modern image formats (WebP/AVIF)
- Avoid unnecessary re-renders
- Use memoization when needed
- Implement pagination/infinite scrolling
- Code splitting for large features


## SEO
- Implement SEO metadata for all pages
- Add Open Graph tags
- Add Twitter Cards
- Use Structured Data (JSON-LD)
- Optimize page titles and descriptions
- Generate SEO-friendly URLs
- Optimize Core Web Vitals


## Security
- Never expose sensitive data in frontend
- Secure authentication flow
- Use JWT securely
- Implement refresh token strategy
- Validate and sanitize user input
- Prevent XSS attacks
- Prevent CSRF where applicable
- Protect private routes
- Implement permission-based access control
- Do not store sensitive information in LocalStorage


## Authentication
- Support Login/Register
- Support OTP verification
- Support Forgot Password
- Support Reset Password
- Handle session expiration
- Protect authenticated routes


## Code Quality
- Use TypeScript strictly
- Follow Clean Code principles
- Follow SOLID principles
- Use reusable components
- Avoid duplicated code
- Keep components small and focused
- Use meaningful naming conventions
- Use absolute imports
- Maintain consistent folder structure
 

## Error Handling
- Use global Error Boundary
- Create reusable error states
- Provide friendly error messages
- Log errors properly
- Handle network failures gracefully


## Notifications
- Use Toastify for notifications
- Standardize success/error messages
- Avoid duplicated toast logic


## Git & Development Workflow
- Use meaningful commit messages
- Follow Git Flow or trunk-based workflow
- Review code before merging
- Keep PRs small and focused


## Documentation
- Maintain README
- Document setup steps
- Document environment variables
- Document API contracts
- Document UI components 


## Environment & Deployment
- Use environment variables 