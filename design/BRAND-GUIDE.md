Aurelo is a fictional premium lifestyle store selling clothing, footwear, accessories and home pieces in India. The customer storefront is a React app; WordPress with WooCommerce supplies products, prices, stock, coupons, orders and page content. Use this system as the visual reference for that React build. It does not copy the Botiga theme.

## Content fundamentals

- Voice is calm, specific and editorial. Speak to the customer as "you", name the brand "Aurelo", and keep sentences short. Example headline: "Considered pieces for every day."
- Sentence case everywhere, including buttons ("Add to bag"). Uppercase only for `overline` eyebrows and badges.
- No emoji, no exclamation marks. Prices use Indian grouping with the rupee sign: ₹3,499, ₹1,24,500.
- Cart language: "bag" in marketing copy, "Cart" in the header icon label and checkout steps.
- Errors say what to fix: "Enter a 10-digit mobile number." Success says what happened: "Linen Overshirt added to your cart."

## Logo

The mark is an arch with an olive leaf, set beside the wordmark "Aurelo" in `display-md` Playfair Display. Render it with the Logo component; never redraw it. Minimum height 24px; clear space equals the arch width. On `surface-inverse` the wordmark uses `ink-inverse`.

## Color

- Charcoal-led, neutral-first. `brand` is the primary action colour; olive (`accent-strong`) is the only hue and marks hover, selected-progress and links.
- Body text is `ink` on `surface`, `surface-warm` or `surface-beige`. Secondary text is `ink-muted`.
- `accent` (#78836a) is a fill colour only, never text. Use `accent-strong` for olive text and icons.
- Sale uses `error` plus a "Sale" word and a percentage; success uses `success` plus a check icon. Never rely on colour alone.
- Alternate `surface` and `surface-warm` bands down a page; use `surface-beige` for at most one promo band per page.
- A dark theme ships with the same token names. Pair `brand` with `on-brand` so the primary button inverts correctly.

## Typography

- Headings: DM Sans (`h1`–`h5`), weight 600, tight tracking on `h1`–`h3`. Body and UI: Inter (`body`, `body-sm`, `label`). Playfair Display is limited to the `display-*` styles for hero, promo, About and 404 headlines.
- Buttons use `button` (DM Sans 600, 0.02em). Eyebrows use `overline`. Prices use `price` or `price-lg`.
- Mobile scale: `display-xl` 44/50, `h1` 36/44, `h2` 28/36, `h3` 24/32; everything else is unchanged.
- Never use more than three families, and never Playfair below 28px.

## Spacing, layout and grid

- Use the 4-based `space-*` scale only. Cards pad `space-5`; summary panels `space-6`; sections pad `space-9` on desktop, `space-8` on tablet, `space-7` on mobile.
- Content width is `container` (1320px) with gutters `gutter-desktop` / `gutter-tablet` / `gutter-mobile`.
- Breakpoints: Desktop 1440 (12 columns, 24px gutters), Tablet 768 (8 columns), Mobile 375 (4 columns, 16px margins). Switch layouts at 1024px and 640px.
- Product grid is 4 columns desktop, 3 at 1024 (shop with sidebar), 2 on tablet and mobile.
- Rounded corners are restrained: `radius-sm` on buttons, inputs and images; `radius-md` on cards and panels; `radius-lg` only on promo panels. Hairlines use `border`; shadows only on floating layers (`shadow-md` menus and toasts, `shadow-lg` drawers and modals).

## Imagery

- Photography is warm, natural light, muted earth tones, shot on neutral backdrops or real interiors. Product images are 4:5, lifestyle images 3:4 or 16:9. Never reuse one image for different products.
- Product cards, galleries, hero and editorial sections in this system use tonal placeholder blocks with an arch silhouette; they stand in for WooCommerce images and must be replaced by real photography.
- Round corners follow `radius-sm` on product images and `radius-md` on category cards.

## Iconography

Line icons, 24px grid, 1.5px stroke, round caps, `currentColor`; 20px in the header and buttons, 18px on product cards. Icons used: search, user, heart, bag, menu, close, chevrons, truck, return, shield, lock, pin, mail, phone, box, leaf, filter. Pair every icon-only button with an `aria-label`.

## Interaction states

Every interactive element defines default, hover, active/selected, focus, disabled, loading, success and error.

- Focus: 2px solid `focus` ring, 2px offset, on all controls.
- Buttons: primary hover turns `accent-strong`; active nudges 1px down; disabled uses `surface-beige` with `ink-muted`; loading shows a spinner and keeps width.
- Selected size chip: `brand` fill with `on-brand`. Selected colour swatch: 2px `ink` ring. Out-of-stock size: dashed, struck through, not focusable.
- Wishlist: outline heart default, filled `error` heart when saved.
- Filter chip selected: `brand` fill. Filter rows show a count in `ink-muted`.
- Inputs: hover darkens the border to `ink`; invalid uses `error` border, `error-soft` fill and a message with an icon; valid shows `success` border.
- Add to cart success: button briefly reads "Added" in `success`, a toast appears with a "View cart" link, the header count updates.
- Empty and error states always carry an icon ring, one sentence of explanation and one primary action.

## Motion

150–200ms ease-out on colour, border and opacity only. Drawers slide 240ms. Skeletons shimmer. No parallax, no autoplay carousels.

## Responsive rules

Do not scale desktop down. Navigation collapses to a hamburger drawer with accordion groups; filters become a bottom-sheet drawer with an "Apply (n)" button; the PDP gallery becomes a swipe carousel with dots and a sticky add-to-cart bar; checkout stacks with the order summary collapsed at the top; the account sidebar becomes a horizontally scrolling tab strip. Touch targets are 44px or larger, inputs 48px, body text never below 14px.

## Pages and content

See the Pages section for the page-by-page specification, Catalog for the dummy content (16 products, testimonials, orders, addresses), and WordPress mapping for which content the CMS owns later. All pages in the Pages group of Components are composed only from the components and tokens above.