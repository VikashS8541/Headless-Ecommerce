# Aurelo design files

Open `index.html` in a browser. Everything is plain HTML and CSS.

- `css/tokens.css`: all colors (light and dark), fonts, spacing, radius, shadows as CSS variables. Single source of truth.
- `css/components.css`: every component class (.btn, .pc, .hdr, .sum ...) using only the tokens.
- `pages/`: one full page layout each (1440px). `MobileScreens.html` has 375 and 768 layouts.
- `components/`: each component with its states.
- `BRAND-GUIDE.md`: usage rules. `pages.md`: page specs. `catalog.md`: dummy content. `wordpress.md`: what WordPress will manage. `tokens.json`: same tokens as data.

Porting to React: turn each component's markup into a component, keep the class names from components.css, read colors and spacing only from tokens. Product images are placeholders (.ph); replace with WooCommerce images. Fonts load from Google Fonts (DM Sans, Inter, Playfair Display).
