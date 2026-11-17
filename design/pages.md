# Pages

Each page below has a live layout in Components → Pages (1440 wide) and, for key pages, a mobile layout in Mobile and tablet. Compose pages only from the shared components.

## A. Home

Order: announcement bar, header (logo, navigation with mega menu, search, account, wishlist with count, cart with count), hero (split 50/50, `display-xl` headline, subtitle, primary and secondary CTA), featured categories (4 `CategoryCard`), new arrivals (4 `ProductCard`), best sellers, promo banner (`surface-beige`, one offer, one CTA), trending products, editorial lifestyle section (large image with caption and link), brand benefits (free shipping, 15-day returns, secure payments, sustainable materials), testimonials (3 quotes), newsletter, Instagram gallery (6 square tiles), footer.

## B. Shop / all products and D. Category

Breadcrumb, page title (`h1`), one-sentence description, product count. Left sidebar (280px): categories, price range, colour swatches, size chips, availability. Toolbar: result count and sort select (Featured, Newest, Price low to high, Price high to low, Top rated). Grid of 9 per page with Sale and New badges, wishlist button and quick view on hover. Pagination below, with "Load more" as the mobile alternative. Category pages add a 360px banner (`surface-warm`, `display-md` title, description, count) above the toolbar. Mobile: filters open in `FilterDrawer`.

## C. Product details

Breadcrumb; gallery (88px thumbnails left, large 4:5 image, zoom on hover); info column: overline category, `h2` name, rating and review count, price with was-price and discount percentage, colour swatches, size chips with size-guide link, stock status (In stock / Only 3 left / Out of stock), quantity, Add to cart, Buy now, wishlist, delivery card (pincode check, estimated delivery, free shipping above ₹2,999, 15-day returns). Tabs: Description, Specifications, Shipping and returns, Reviews (rating summary, bars, review list). Related products and Recently viewed below.

## E. Search results

Search input in the overlay with suggestions and recent searches. Results page: "24 results for 'linen'", product grid, and the empty state with suggestions when there is no match.

## F. Wishlist

Saved products as cards with stock status, Remove and Add to cart. Empty state: heart ring, "Nothing saved yet", Continue shopping.

## G. Cart

Two columns: items (image, name, size and colour, unit price, quantity, Remove, Save for later), coupon field with Apply, summary (subtotal, shipping estimate, discount, total), Continue shopping, Proceed to checkout. Free-shipping progress bar. Recommended products below. Empty cart state is its own layout.

## H. Checkout

Single page, two columns, no header navigation. Steps: Contact (email), Shipping address (first and last name, phone, country, state, city, street, PIN code), Shipping method (Standard ₹99, Express ₹199, free above ₹2,999), Payment (UPI / cards / netbanking online, Cash on delivery). Summary on the right with items, coupon, breakdown and Place order. Secure indicators: lock, "SSL encrypted", accepted payment marks. States: inline validation per field with `error` messages, an error summary banner, a loading Place order button ("Placing order"), and a disabled state while invalid.

## I. Order success

Success ring with check, "Thank you, Anaya", order number, summary, payment method, shipping address, estimated delivery, View order and Continue shopping.

## J. Authentication

Split layout: image left on desktop (hidden on mobile), form right. Login (email, password, remember me, forgot password, sign up link), Sign up (full name, email, password, confirm, terms), Forgot password, Reset password, Email verification. Show validation errors inline and a success banner after a reset.

## K. Customer account

Sidebar (Dashboard, My profile, My orders, My addresses, My wishlist, Account settings, Logout) beside content. Overview: welcome, stat tiles (total, pending, completed), recent orders, recent activity, account summary. Orders table: ID, date, products, total, payment status, order status, View details. Order details with items, totals and address. Track order timeline: Order placed, Processing, Shipped, Out for delivery, Delivered. Addresses: cards with Edit, plus add and edit form. Profile edit, settings and change password. Mobile: sidebar becomes a scrolling tab strip.

## L. About

Hero image, brand story, mission and three values, statistics (founded, pieces sold, cities shipped, return rate), lifestyle imagery, why choose us, closing CTA.

## M. Contact

Hero, two columns: form (name, email, phone, subject, message, Send) and details (address, email, phone, hours), map placeholder, link to FAQ.

## N. FAQ

Category tabs or anchor list (Orders, Payments, Shipping, Returns, Refunds, Products, Account) with `Accordion` per category; one panel open at a time.

## O. Policies and 404

Policy pages share a narrow reading layout (760px, `h1`, dated update line, `h2` sections, a left on-this-page list on desktop). The 404 page: `display-xl` "404", a sentence, search field and two actions.

## Global states checklist

Default, hover, active, selected, focus, disabled, loading, success, error, empty. Previews of each live in the component cards: Button, FormFields, VariantPicker, ProductCard, Toast, Skeleton, EmptyState, and the pages (checkout errors, empty cart, empty wishlist, search empty).