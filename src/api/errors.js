/** Turns any failed request into a short sentence a customer can read. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const msg = error?.response?.data?.message
  if (msg) return String(msg).replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#8377;/g, '₹')
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the store. Check that WordPress is running.'
  return fallback
}
