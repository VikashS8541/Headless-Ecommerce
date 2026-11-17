# WordPress mapping

The React frontend reads everything below from WordPress and WooCommerce later. Design components expect these fields; nothing here asks for a separate admin dashboard, and the existing WordPress admin stays the only back office.

| Design element | Source of truth |
|---|---|
| Hero, promo banner, editorial section (image, headline, subtitle, CTA label and link) | WordPress page fields (ACF or block fields) on the Home page |
| Navigation and mega menu | WordPress menus; featured image per top-level item |
| Product name, description, specifications, gallery | WooCommerce product, product gallery, attributes |
| Price, sale price, discount percentage | WooCommerce regular and sale price; percentage is computed in React |
| Colour and size options, sold-out sizes | WooCommerce variable product attributes and variation stock |
| Categories and category banners | WooCommerce product categories (image, description) |
| Badges: New, Sale, Low stock | New by date, Sale by sale price, Low stock by stock quantity threshold |
| Stock availability | WooCommerce stock status and quantity |
| Reviews and ratings | WooCommerce product reviews |
| Coupons, shipping methods, payment methods | WooCommerce coupons, shipping zones, payment gateways (COD plus online) |
| Orders, customer profile, addresses | WooCommerce orders and customers, exposed to the account dashboard |
| Testimonials | Custom post type "Testimonial" (quote, name, city) |
| About and Contact content, policy pages, FAQ | WordPress pages; FAQ as repeater of category, question, answer |
| Announcement bar, footer columns, social links | Site options |

Design constraints for the future build: every text field must tolerate two lines more than the dummy copy; images arrive at 4:5 (product), 16:9 (banners) and 1:1 (social); the layout must render when a product has one colour or no sale price; empty lists always fall back to the EmptyState component.