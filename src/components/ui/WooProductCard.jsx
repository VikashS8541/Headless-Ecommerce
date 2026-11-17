import ProductCard from '../ProductCard.jsx'
import { cardProps } from '../../lib/products.js'

export default function WooProductCard({ product }) {
  return <ProductCard {...cardProps(product)} />
}
