import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import * as wp from './wordpress.js'
import * as cartApi from './cart.js'
import * as account from './account.js'
import { readCache, remember } from './persist.js'

// React Query caches every answer so a page does not re-download what it already has.

/* ---------- Content from WordPress ---------- */
// The last saved answer is shown at once (initialData); initialDataUpdatedAt: 0 marks it stale so fresh data still loads.
const saved = key => ({ initialData: readCache(key), initialDataUpdatedAt: 0 })

export const queries = {
  site: { queryKey: ['site'], queryFn: remember('site', wp.fetchSite), staleTime: 60_000 },
  categories: { queryKey: ['categories'], queryFn: remember('categories', wp.fetchCategories), staleTime: 300_000 },
  testimonials: { queryKey: ['testimonials'], queryFn: remember('testimonials', wp.fetchTestimonials) },
}

export const useSite = () => useQuery({ ...queries.site, ...saved('site') })

export const useProducts = (params = {}, options = {}) =>
  useQuery({ queryKey: ['products', params], queryFn: () => wp.fetchProducts(params), placeholderData: keepPreviousData, ...options })

export const useProduct = slug => useQuery({ queryKey: ['product', slug], queryFn: () => wp.fetchProduct(slug), enabled: !!slug })

export const useCategories = () => useQuery({ ...queries.categories, ...saved('categories') })

export const usePage = slug => useQuery({ queryKey: ['page', slug], queryFn: () => wp.fetchPage(slug), enabled: !!slug })

export const useFaqs = () => useQuery({ queryKey: ['faqs'], queryFn: wp.fetchFaqs })

export const useTestimonials = () => useQuery({ ...queries.testimonials, ...saved('testimonials') })

export const useReviews = productId => useQuery({ queryKey: ['reviews', productId], queryFn: () => wp.fetchReviews(productId), enabled: !!productId })

/* ---------- Cart (WooCommerce keeps it on the server) ---------- */
export const useCart = () => useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart, staleTime: 10_000 })

/** Every cart change returns the fresh cart, so we simply store it. */
export function useCartActions() {
  const qc = useQueryClient()
  const save = cart => qc.setQueryData(['cart'], cart)
  return {
    add: useMutation({ mutationFn: cartApi.addItem, onSuccess: save }),
    update: useMutation({ mutationFn: ({ key, quantity }) => cartApi.updateItem(key, quantity), onSuccess: save }),
    remove: useMutation({ mutationFn: cartApi.removeItem, onSuccess: save }),
    applyCoupon: useMutation({ mutationFn: cartApi.applyCoupon, onSuccess: save }),
    removeCoupon: useMutation({ mutationFn: cartApi.removeCoupon, onSuccess: save }),
    setCustomer: useMutation({ mutationFn: ({ billing, shipping }) => cartApi.updateCustomer(billing, shipping), onSuccess: save }),
    selectRate: useMutation({ mutationFn: ({ packageId, rateId }) => cartApi.selectShippingRate(packageId, rateId), onSuccess: save }),
    checkout: useMutation({ mutationFn: cartApi.placeOrder, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) }),
  }
}

/* ---------- Customer account (WordPress users) ---------- */
export function useAuth() {
  const qc = useQueryClient()
  const hasToken = !!account.getToken()
  const me = useQuery({ queryKey: ['me'], queryFn: account.fetchMe, enabled: hasToken, retry: false, staleTime: 60_000 })
  const done = res => {
    account.setToken(res.token)
    qc.setQueryData(['me'], res.user)
    qc.invalidateQueries({ queryKey: ['orders'] })
  }
  return {
    user: hasToken ? me.data : undefined,
    loading: hasToken && me.isLoading,
    loggedIn: hasToken && !me.isError,
    login: useMutation({ mutationFn: account.login, onSuccess: done }),
    register: useMutation({ mutationFn: account.register, onSuccess: done }),
    logout: () => {
      account.setToken(null)
      qc.removeQueries({ queryKey: ['me'] })
      qc.removeQueries({ queryKey: ['orders'] })
    },
    updateProfile: useMutation({ mutationFn: account.updateMe, onSuccess: user => qc.setQueryData(['me'], user) }),
    changePassword: useMutation({ mutationFn: account.changePassword, onSuccess: res => account.setToken(res.token) }),
  }
}

export const useOrders = enabled => useQuery({ queryKey: ['orders'], queryFn: account.fetchOrders, enabled })

export const useVariations = (productId, enabled) =>
  useQuery({ queryKey: ['variations', productId], queryFn: () => wp.fetchVariations(productId), enabled: !!productId && enabled })
