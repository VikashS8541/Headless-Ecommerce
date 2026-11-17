import Layout from '../components/layout/Layout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import { useProducts, useSite } from '../api/hooks.js'
import { useWishlist } from '../lib/wishlist.js'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const { data: site } = useSite()
  const { data, isLoading, isError } = useProducts({ include: ids, per_page: 24 }, { enabled: ids.length > 0 })
  // Show only products that are still saved (the list updates the moment a heart is un-filled)
  const items = (data?.items || []).filter(p => ids.includes(p.id))

  return (
    <Layout>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-24 lg:pt-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          {site?.options?.wishlist_title && <h1 className="h1">{site.options.wishlist_title}</h1>}
          <p className="mt-2 text-ink-muted">{ids.length} saved {ids.length === 1 ? 'piece' : 'pieces'}</p>
          <div className="mt-8">
            {ids.length === 0 ? (
              <EmptyState icon="heart" kind="wishlist_empty" actionTo="/shop" />
            ) : (
              <ProductGrid products={items} loading={isLoading} error={isError} skeletons={ids.length} />
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
