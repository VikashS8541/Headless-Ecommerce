import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'

// Each page is loaded only when someone opens it (code splitting), so the first visit downloads less.
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'))
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage.jsx'))
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'))
const AccountOverviewPage = lazy(() => import('./pages/AccountOverviewPage.jsx'))
const AccountOrdersPage = lazy(() => import('./pages/AccountOrdersPage.jsx'))
const AccountProfilePage = lazy(() => import('./pages/AccountProfilePage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'))
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const PageLoading = () => <div className="min-h-[60vh]" aria-busy="true" />

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account" element={<AccountOverviewPage />} />
          <Route path="/account/orders" element={<AccountOrdersPage />} />
          <Route path="/account/profile" element={<AccountProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
