# Aurelo Storefront: the complete beginner's guide

This guide explains **everything that was done in this project, from the first file to the last**, in plain language.
You do not need to know React, Tailwind or WordPress APIs to follow it. Every new word is explained the first time it appears.

---

## Table of contents

1. [What is this project?](#1-what-is-this-project)
2. [Words you will see (glossary)](#2-words-you-will-see-glossary)
3. [The big picture](#3-the-big-picture)
4. [How to run everything](#4-how-to-run-everything)
5. [Folder map: what lives where](#5-folder-map-what-lives-where)
6. [The story, step by step (what was done, in order)](#6-the-story-step-by-step-what-was-done-in-order)
7. [Pages and their web addresses (routes)](#7-pages-and-their-web-addresses-routes)
8. [How the styling works (CSS + Tailwind)](#8-how-the-styling-works-css--tailwind)
9. [How React talks to WordPress](#9-how-react-talks-to-wordpress)
10. [Your WordPress cheat sheet: change X in the dashboard, see it on the site](#10-your-wordpress-cheat-sheet)
11. [Step-by-step tasks](#11-step-by-step-tasks)
12. [What WordPress handles and what React handles](#12-what-wordpress-handles-and-what-react-handles)
12A. [Speed and code quality](#12a-speed-and-code-quality-optimisation)
13. [Troubleshooting](#13-troubleshooting)
14. [Where to go next](#14-where-to-go-next)

---

## 1. What is this project?

**Aurelo** is an online shop (a fictional premium lifestyle brand selling clothes, footwear, accessories and home pieces in India).

The shop is built in two halves:

| Half | What it is | Where it lives | Address |
|---|---|---|---|
| **Front end** ("what visitors see") | A React website | this folder: `headless-ecommerce-frontend` | `http://localhost:5173` while developing |
| **Back end** ("where you manage content") | WordPress + WooCommerce | `Local Sites/headless-ecommerce` | `http://headless-ecommerce.local/wp-admin/` |

This split is called **"headless"**: WordPress has no visible website of its own. It only stores your content (products, pages, text, images). The React site asks WordPress for that content and shows it with the Aurelo design.

> **Why do it this way?** The design is fast and fully custom (React), while you still edit everything from the familiar WordPress dashboard.

---

## 2. Words you will see (glossary)

| Word | Plain meaning |
|---|---|
| **React** | A tool for building websites out of small reusable pieces called *components*. |
| **Component** | One piece of the page, like the header, a product card or the footer. Written once, used many times. |
| **Page** (in React) | A component that is a whole screen, such as the Home page. |
| **Route** | A web address and the page it shows. `/shop` shows the Shop page. |
| **Vite** | The tool that runs the site on your computer (`npm run dev`) and builds it for release. |
| **Tailwind CSS** | A way to style things by adding short class names, e.g. `flex gap-4 text-sm`. |
| **Design tokens** | The brand's named colours, fonts and sizes (`--brand`, `--accent`...). Stored in `src/css/tokens.css`. |
| **WordPress** | The content management system (CMS) where you write and manage content. |
| **WooCommerce** | The WordPress shop plugin: products, categories, prices, stock. |
| **API** | A doorway a program can use to ask another program for data. |
| **REST API** | A kind of API that works through web addresses ending in `/wp-json/...`. |
| **Store API** | WooCommerce's public REST API for shop data. No password needed to read products. |
| **JSON** | The text format APIs answer with, like `{"name": "Linen Shirt"}`. |
| **Hook** (React) | A small function starting with `use...` that gives a component some ability (like fetching data). |
| **React Query** | A library that fetches data, remembers it (cache) and shows loading and error states. |
| **mu-plugin** | "Must-use plugin": a WordPress plugin that loads by itself with no activation. |
| **CPT** | "Custom post type": a new kind of content in WordPress (we added Testimonials and FAQs). |
| **Slug** | The URL-friendly name of something, e.g. the product "Linen Shirt" has the slug `linen-shirt`. |
| **Responsive** | The layout adjusts to phone, tablet and desktop widths. |
| **Breakpoint** | The screen width where the layout changes. We use 640px (`sm`), 768px (`md`), 1024px (`lg`). |

---

## 3. The big picture

```
 Visitor's browser
        │  opens http://localhost:5173/shop
        ▼
 ┌───────────────────────────┐        asks for data         ┌───────────────────────────────┐
 │  React site (this repo)   │ ───────────────────────────▶ │  WordPress (headless-         │
 │  pages + components +     │   GET /wp-json/wc/store/...  │  ecommerce.local)             │
 │  Tailwind styling         │ ◀─────────────────────────── │  WooCommerce + Aurelo plugin  │
 └───────────────────────────┘        answers in JSON       └───────────────────────────────┘
        │                                                              ▲
        ▼ shows the finished page                                      │ you edit content here
 Visitor sees products, text, menus                         http://headless-ecommerce.local/wp-admin/
```

**In one sentence:** you edit in WordPress, the React site fetches the new content the next time the page loads (or within about 30 seconds), and displays it.

---

## 4. How to run everything

### 4.1 Requirements
* **Local** (the app that runs your WordPress site) must be running, with the site `headless-ecommerce` **started**.
* **Node.js** installed (you already have it).

### 4.2 Start the React site
Open a terminal in the project folder and run:

```bash
npm install      # only the first time, downloads the tools
npm run dev      # starts the site
```

Open the address it prints, normally **http://localhost:5173**.

### 4.3 The `.env` file (the link to WordPress)
The file `.env` in the project root contains one line:

```
VITE_WP_URL=http://headless-ecommerce.local
```

This tells React where WordPress lives. If your Local site address ever changes, change it here and restart `npm run dev`.
`.env.example` is a copy that shows what the file should look like.

### 4.4 Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development site with live reload. |
| `npm run build` | Makes the final optimised site in the `dist` folder. |
| `npm run lint` | Checks the code for mistakes. |
| `npm run preview` | Shows the built site locally. |

---

## 5. Folder map: what lives where

```
headless-ecommerce-frontend/
├── .env                      ← WordPress address (VITE_WP_URL)
├── index.html                ← The single HTML file; React fills the <div id="root">
├── package.json              ← List of tools the project uses + the npm commands
├── tailwind.config.js        ← Tailwind settings (brand colours, fonts, radius, shadows)
├── postcss.config.js         ← Lets Tailwind run
├── vite.config.js            ← Vite settings
│
├── design/                   ← The ORIGINAL static design files you gave me (kept for reference)
│   ├── index.html            ← Open this to browse the original HTML designs
│   ├── pages/, components/   ← One HTML file per page / component
│   ├── BRAND-GUIDE.md, pages.md, catalog.md, wordpress.md, tokens.json
│
├── docs/
│   ├── PROJECT-GUIDE.md      ← This file
│   └── aurelo-products.csv   ← 16 Aurelo products you can import into WooCommerce
│
├── wordpress/
│   ├── aurelo-headless.php         ← Copy of plugin 1: Aurelo Content, Testimonials, FAQs, menus, site endpoint
│   └── aurelo-headless-extras.php  ← Copy of plugin 2: contact, newsletter, login, profile, orders
│       (the LIVE copies are in WordPress: wp-content/mu-plugins/)
│
└── src/                      ← ALL the React code
    ├── main.jsx              ← Starting point: loads CSS, React Query and the router
    ├── App.jsx               ← The route list (address → page)
    ├── css/
    │   ├── tokens.css        ← Brand colours, fonts, spacing (light + dark)
    │   ├── components.css    ← Design-system classes (.btn, .input, .pc, .badge ...)
    │   └── tailwind.css      ← Turns Tailwind on (loaded last)
    ├── api/
    │   ├── wordpress.js      ← Content calls: products, categories, pages, FAQs, site settings
    │   ├── cart.js           ← Cart + checkout calls (WooCommerce Store API, Cart-Token)
    │   ├── account.js        ← Login, register, profile, orders, contact, newsletter
    │   ├── errors.js         ← Turns a failed request into a readable sentence
    │   └── hooks.js          ← React Query hooks (useProducts, useCart, useAuth ...)
    ├── lib/
    │   ├── format.js         ← Price format, HTML clean-up, WordPress URL → React route
    │   ├── menus.js          ← Menu defaults + helper
    │   ├── products.js       ← Turns a WooCommerce product into card data
    │   ├── wishlist.js       ← Hearts saved in the browser
    │   ├── orders.js         ← Order status labels, money and date formatting
    │   └── india.js          ← List of Indian states for address forms
    ├── components/
    │   ├── Logo.jsx, Icon.jsx, Accordion.jsx, ProductCard.jsx
    │   ├── layout/           ← Layout (header+footer), Header, Footer, AnnouncementBar,
    │   │                       AccountLayout, AuthLayout, CheckoutLayout
    │   └── ui/               ← ProductGrid, ProductListing, Pagination, EmptyState, Field,
    │                           SmartLink, Html, Stars, WooProductCard, OrdersTable,
    │                           NewsletterForm, ContactForm
    └── pages/                ← One file per screen (Home, Shop, Product, Cart ...)
```

---

## 6. The story, step by step (what was done, in order)

### Step 1: Review of the files you added
You gave me a set of **static HTML design files**: 19 pages, 27 components, two CSS files (`tokens.css`, `components.css`) and documents (brand guide, page specs, catalog, WordPress mapping).

What I found:
* All 490 links were `href="#"` (they went nowhere).
* `index.html` at the project root was your design index, so it blocked the real React app. It pointed to folders that did not exist at that path.
* The React app was still the empty Vite starter ("Hello world").
* `components.css` had **no responsive rules** (no `@media`), so the layouts only worked on desktop.

### Step 2: Turning the HTML designs into a real React app
* I wrote a small converter that read every HTML page and produced a React page (`.jsx`), keeping the **same classes and markup** so the look stays identical to your design.
* Your original files were kept safe in the `design/` folder.
* The repeated parts (announcement bar, header, footer, logo, product card, accordion, account sidebar, login layout, checkout layout) became **shared components**, written once and used on every page.
* `index.html` was restored as the normal Vite entry, and `src/main.jsx` now loads `tokens.css` and `components.css`.

### Step 3: Making every link work (routing)
* I installed the router (`react-router`) and created `src/App.jsx`, which lists every address and its page (see section 7).
* All `href="#"` links became real `<Link to="/...">` links, so clicking moves between pages without reloading.
* Pages that were several "states" drawn on one design sheet were split into their own addresses:
  the 6 login/sign-up cards became `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/email-verified`; the empty cart became `/cart/empty`.
* A few buttons had no link at all in the design (for example the hero buttons). I found and fixed those too.
* Menu items that have no designed page yet point to the nearest sensible page (see section 12).

### Step 4: Tailwind and responsive design (your request)
You asked to use Tailwind classes for layout (flex, grid, responsive) and **no inline styles**.
* All 259 inline `style="..."` rules were converted into Tailwind classes. Example: `style="display:flex;gap:16px"` became `flex gap-4`.
* Layout helpers from your CSS (`row`, `col`, `grid g3`...) were replaced by Tailwind (`flex items-center`, `grid grid-cols-1 md:grid-cols-3`...).
* **Brand colours were wired into Tailwind**, so `bg-surface-warm`, `text-ink-muted`, `border-border`, `text-error`, `bg-brand` use exactly your tokens (and dark mode still works).
* Pages now adapt: 4-column product grids become 2 columns on phones, split sections stack, the account sidebar becomes a horizontal scroll strip, and the header gets a **hamburger menu** on small screens.
* Your design-system classes (`.btn`, `.input`, `.pc`, `.badge`...) were **kept** so buttons and cards look exactly as designed.

### Step 5: Connecting to WordPress (this request)
I inspected `http://headless-ecommerce.local`. It already had WooCommerce with sample products, and the public REST APIs are open. So:

1. **A WordPress plugin was added** (`aurelo-headless.php`) to give you an admin screen for the content that WooCommerce does not manage (hero text, promo banner, footer, contact details...), plus Testimonials, FAQs and menu locations. Details in section 9.
2. **A data layer was added to React** (`src/api/`) that fetches products, categories, pages, FAQs, testimonials, menus and site settings.
3. **Pages were rewired** to show WordPress data instead of fixed text: Home, Shop, Category, Product, Search, FAQ, Contact, About, Policies, header menu, footer, announcement bar.
4. **Loading and empty states** were added (grey shimmer blocks while loading, a friendly message when nothing exists).
5. **A product import file** (`docs/aurelo-products.csv`) was created from your `catalog.md` so you can fill the shop with the 16 Aurelo products in one click.

### Step 6: Moving the "backend things" into WordPress
You then asked for the front end to be React and everything backend to be WordPress. So the remaining shopping features were connected:
* **Cart and checkout** use WooCommerce's own Store API: the cart lives on the server, shipping prices and totals are calculated by WooCommerce, and placing an order creates a real WooCommerce order (see section 12).
* **Login, registration, forgot password, profile, addresses and order history** use WordPress users and WooCommerce customers, through new endpoints in the second plugin file.
* **Demo payments**: UPI, card, netbanking and COD are fake (no money moves), so the whole shopping journey can be shown to a client.
* **Contact form** saves to a new **Messages** menu and emails the admin; **newsletter** saves to **Subscribers**.
* The **wishlist** is a browser-side list of hearts (it needs no server).
* Design-only screens that make no sense with a real backend (verify-email, email-verified, reset-password, empty cart) were removed; the empty states are part of the real pages.

### Step 7: Demo payments
Because this is a client **demo**, not a live shop, a small WordPress file (`aurelo-demo-payments.php`) adds dummy payment methods so checkout completes end to end with no real gateway. A test order (#63) was placed to verify it.

### Step 8: Optimisation
Lazy-loaded pages, separate library files, faster fonts, responsive images, cached data, removal of unused code (section 12A).

### Step 9: Documentation
This file.

---

## 7. Pages and their web addresses (routes)

All routes are defined in `src/App.jsx`. Every page is **lazy loaded**: its code is downloaded only when someone opens it.

| Address | Page file | Data comes from (all WordPress) |
|---|---|---|
| `/` | `HomePage.jsx` | Aurelo Content settings, products, categories, testimonials |
| `/shop` | `ShopPage.jsx` | WooCommerce products |
| `/category/:slug` e.g. `/category/footwear` | `CategoryPage.jsx` | WooCommerce category + products (`sale` = products on sale) |
| `/product/:slug` | `ProductPage.jsx` | WooCommerce product, reviews, related. **Add to cart works** |
| `/search?q=linen` | `SearchResultsPage.jsx` | WooCommerce product search |
| `/wishlist` | `WishlistPage.jsx` | Hearts saved in the visitor's browser + WooCommerce products |
| `/cart` | `CartPage.jsx` | **WooCommerce cart** (quantities, remove, coupons, free-shipping bar) |
| `/checkout` | `CheckoutPage.jsx` | **WooCommerce checkout** (address, shipping rates, payment, places the real order) |
| `/order-success` | `OrderSuccessPage.jsx` | The WooCommerce order that was just placed |
| `/login`, `/register`, `/forgot-password` | matching `...Page.jsx` | **WordPress users** |
| `/account`, `/account/orders`, `/account/profile` | `Account...Page.jsx` | **WordPress customer + WooCommerce orders** (login required) |
| `/faq` | `FAQPage.jsx` | FAQs menu |
| `/contact` | `ContactPage.jsx` | Aurelo Content (details) + form saved as **Messages** |
| `/about` | `AboutPage.jsx` | WordPress page `about` (else the designed layout) |
| `/policies/:slug` | `PolicyPage.jsx` | WordPress page with that slug |
| anything else | `NotFoundPage.jsx` | none |

## 8. How the styling works (CSS + Tailwind)

There are three CSS files, loaded in this order in `src/main.jsx`:

1. **`tokens.css`**: the brand. Colours like `--brand: #202522` (charcoal) and `--accent: #78836a` (olive), fonts (DM Sans, Inter, Playfair Display), spacing and radius. It also contains the **dark theme**. Change a brand colour here, in one place.
2. **`components.css`**: ready-made classes for design-system parts: `.btn`, `.btn-primary`, `.input`, `.pc` (product card), `.badge`, `.acc` (accordion), `.ft` (footer)...
3. **`tailwind.css`**: switches Tailwind on. It is loaded **last** so a Tailwind class always wins over a component default (for example `btn mt-4` adds a top margin).

### Using Tailwind here: a 2-minute lesson
A Tailwind class does one small thing. You combine them:

| Class | Meaning |
|---|---|
| `flex` | Lay children out in a row |
| `items-center` | Centre vertically |
| `justify-between` | Push children to the two ends |
| `gap-4` | 16px space between children |
| `grid grid-cols-2` | Grid with 2 columns |
| `lg:grid-cols-4` | From 1024px wide and up, use 4 columns |
| `md:px-6` | From 768px wide and up, 24px side padding |
| `text-sm`, `text-[18px]` | Font size (the `[18px]` form is an exact value) |
| `font-semibold` | Bolder text |
| `bg-surface-warm` | Warm off-white background (brand token) |
| `text-ink-muted` | Soft grey text (brand token) |
| `border border-border` | A 1px hairline in the brand border colour |
| `rounded-md` | Brand medium radius |
| `hidden lg:flex` | Hidden on phones, shown as flex from 1024px |

**Mobile first:** a class with no prefix applies to every size; `sm:`, `md:`, `lg:` add changes as the screen gets wider. Example from the shop grid: `grid-cols-2 lg:grid-cols-4` means "2 columns, but 4 from 1024px".

**Brand colours available as classes** (all defined in `tailwind.config.js`, reading `tokens.css`):
`surface`, `surface-warm`, `surface-beige`, `surface-inverse`, `ink`, `ink-muted`, `ink-inverse`, `border`, `border-strong`, `brand`, `on-brand`, `accent`, `accent-strong`, `on-accent-strong`, `accent-soft`, `success`, `success-soft`, `error`, `error-soft`. Use them like `bg-brand`, `text-error`, `border-border`.

> Tailwind's own reset ("preflight") is switched off on purpose, so your original base styles are not changed.

---

## 9. How React talks to WordPress

### 9.1 What WordPress gives us (three sources)

| # | Source | Address (after `http://headless-ecommerce.local/wp-json`) | Used for |
|---|---|---|---|
| 1 | **WooCommerce Store API** (built in, public) | `/wc/store/v1/products`, `/wc/store/v1/products/categories`, `/wc/store/v1/products/reviews` | Products, prices, stock, images, categories, reviews |
| 2 | **WordPress REST API** (built in, public) | `/wp/v2/pages`, `/wp/v2/faqs`, `/wp/v2/faq_categories`, `/wp/v2/testimonials` | Page text (About, policies), FAQs, testimonials |
| 3 | **Aurelo endpoint** (added by our plugin) | `/aurelo/v1/site` | Site settings from "Aurelo Content" + all menus in one answer |

You can paste any of these into your browser to see the raw data. Example: `http://headless-ecommerce.local/wp-json/wc/store/v1/products`.

### 9.2 The plugin: `aurelo-headless.php`
Location (live): `Local Sites/headless-ecommerce/app/public/wp-content/mu-plugins/aurelo-headless.php`
(A copy is in this project at `wordpress/aurelo-headless.php`.)

Because it sits in `mu-plugins`, WordPress loads it **automatically. No activation is needed.**

It adds to the WordPress dashboard:
* **Aurelo Content** menu: one screen with all the text and images listed in section 10.
* **Testimonials** menu: customer quotes (title = name, content = quote, a "Customer city" box).
* **FAQs** menu: questions with an optional "FAQ categories" grouping.
* **Menu locations** (Appearance > Menus): *Primary (header)*, *Footer: Shop*, *Footer: Help*, *Footer: Company*.
* The public endpoint `/wp-json/aurelo/v1/site`.

If a field in "Aurelo Content" is left empty, a sensible default (the original design text) is used.

A **second plugin file**, `aurelo-headless-extras.php` (same folder, also copied to `wordpress/`), adds:
* **Messages** and **Subscribers** menus (where the contact form and newsletter land).
* Endpoints: `POST /aurelo/v1/contact`, `/subscribe`, `/auth/login`, `/auth/register`, `/auth/forgot`, `GET|POST /me`, `POST /me/password`, `GET /orders`.
* A small hook that attaches an order to the logged-in customer.

### 9.3 What React does (the files in `src/api` and `src/lib`)

* **`src/api/wordpress.js`**: plain functions: `fetchProducts`, `fetchProduct`, `fetchCategories`, `fetchPage`, `fetchFaqs`, `fetchTestimonials`, `fetchSite`, `fetchReviews`. They use `axios` and the address from `.env`.
* **`src/api/hooks.js`**: wraps each function in a **React Query** hook (`useProducts`, `useProduct`, `useSite`...). A hook gives a page `data`, `isLoading` and `isError`, and **remembers answers** so going back to a page is instant.
* **`src/lib/format.js`**:
  * `formatPrice()` turns WooCommerce's price (stored in paise, e.g. `349900`) into `₹3,499` with Indian grouping.
  * `stripHtml()` turns `Men &amp; Women` into plain text.
  * `cleanHtml()` makes WordPress editor HTML **safe** (DOMPurify) before showing it.
  * `toRoute()` translates WordPress addresses into React routes, e.g. `.../product-category/clothing/` → `/category/clothing`.
* **`src/lib/products.js`**: `cardProps()` converts one WooCommerce product into what a product card needs (name, image, price, sale badge, discount %).
* **`src/components/ui/`**: reusable pieces: `ProductGrid` (grid + loading shimmer + empty state), `ProductListing` (filters, sort, pagination), `Pagination`, `EmptyState`, `SmartLink`, `Html`, `Stars`.

### 9.4 A worked example: what happens when you open `/shop`
1. The router sees `/shop` and shows `ShopPage.jsx`.
2. `ShopPage` shows `ProductListing`, which calls `useProducts({ per_page: 9, page: 1, ... })`.
3. React Query calls `fetchProducts`, which requests `GET /wc/store/v1/products?per_page=9&page=1&orderby=menu_order&order=asc`.
4. While waiting, grey shimmer cards are shown.
5. WordPress answers with JSON (and the total count in a header).
6. Each product becomes a `ProductCard` through `cardProps()`; if there is none, a friendly empty message appears.
7. Filters and sort write to the web address (`?sort=price-asc&page=2&instock=1&min=1000`), so a filtered page can be bookmarked or shared.

### 9.5 CORS (why the browser is allowed to ask WordPress)
The React site (`localhost:5173`) and WordPress (`headless-ecommerce.local`) are different addresses, so the browser checks permission (CORS). Your WordPress already allows this. **When you publish the site for real**, make sure WordPress allows your live site address.

---

## 10. Your WordPress cheat sheet

Open **http://headless-ecommerce.local/wp-admin/**. Everything below is changed there.

| I want to change... | Go to... | Shows up on... |
|---|---|---|
| The top announcement bar text | **Aurelo Content > Announcement bar** | Every page, top |
| Home hero: small label, headline, text, 2 buttons, image | **Aurelo Content > Home: hero** | Home |
| Home promo banner (offer text, button, image) | **Aurelo Content > Home: promo banner** | Home |
| Home "Journal" story block | **Aurelo Content > Home: editorial** | Home |
| The 4 benefits row (free shipping, returns...) | **Aurelo Content > Home: benefits** | Home |
| Newsletter headline and text | **Aurelo Content > Home: newsletter** | Home |
| Footer text, Instagram handle, copyright, payment line | **Aurelo Content > Footer** | Every page, bottom |
| Address, email, phone and opening hours | **Aurelo Content > Contact details** | Contact page |
| Header navigation links | **Appearance > Menus** (location *Primary (header)*) | Header |
| Footer link columns | **Appearance > Menus** (locations *Footer: Shop / Help / Company*) | Footer |
| Products (name, price, sale price, images, stock, description) | **Products** | Home, Shop, Category, Search, Product |
| Categories (name, image, description) | **Products > Categories** | Home category cards, Category page banner, shop sidebar |
| Customer quotes | **Testimonials** | Home "Kind words" |
| FAQ questions and answers | **FAQs** (group them in *FAQ categories*) | FAQ page |
| About page text | **Pages > About** (slug `about`) | About page |
| Messages sent from the Contact form | **Messages** | (you read them in WordPress; also emailed to the admin address) |
| Newsletter sign-ups | **Subscribers** | (you read them in WordPress) |
| Orders placed on the site | **WooCommerce > Orders** | Customer's **My orders** page |
| Customers who registered | **Users** | They can log in on the React site |
| Coupons used in the cart | **Marketing > Coupons** (WooCommerce) | Cart "Coupon code" box |
| Shipping prices | **WooCommerce > Settings > Shipping** | Checkout "Shipping method" |
| Payment methods | **WooCommerce > Settings > Payments** | Checkout "Payment" |
| Policy pages (returns, shipping, privacy, terms) | **Pages** with slug `returns`, `shipping`, `privacy`, `terms` | `/policies/returns` etc. |

**Home page product rows** pick automatically (no setup):
* *Just landed*: newest products.
* *Most loved this season*: most popular (by sales).
* *What everyone is wearing*: best rated.

**Product badges** appear by themselves: **Sale** when a sale price is set, **Sold out** when out of stock, **Only N left** when WooCommerce marks low stock.

---

## 11. Step-by-step tasks

### 11.1 Fill the shop with the 16 Aurelo products (one-time, recommended)
1. In WordPress go to **Products > All Products > Import** (button at the top).
2. Choose the file `docs/aurelo-products.csv` from this project.
3. Click **Continue**, keep the automatic column mapping, then **Run the importer**.
4. This creates the categories too (Clothing, Men, Women, Footwear, Accessories, Lifestyle).
5. (Optional) delete the old WooCommerce sample products: **Products**, select the sample ones, **Move to Trash**.
6. Add a **photo** to each product (open the product, "Product image" box). Products without photos show a soft placeholder block.

### 11.2 Add a product
**Products > Add New**: title, price (*Regular price*; add a *Sale price* to show the Sale badge and discount), product image, gallery, short description, description, category on the right, then **Publish**. It appears on the site within about 30 seconds (refresh the React page).

### 11.3 Make the header menu match your design
1. **Appearance > Menus > Create a new menu** (name it "Main").
2. Add items. For **categories** use *Product categories* (left box); for the shop use *Custom Links* with URL `/shop`.
3. Tick **Display location: Primary (header)** and click **Save Menu**.
4. Do the same for the three footer menus.

> If a menu location is empty, the site shows the original default links, so nothing breaks.

### 11.4 Edit the home page hero and banners
**Aurelo Content**: change text, click **Choose image** to pick from the Media Library, then **Save changes**. Button links can be shop paths such as `/shop`, `/category/sale`, `/product/linen-overshirt`, or a full `https://...` address.

### 11.5 Add testimonials
**Testimonials > Add New**: *Title* = customer name, *content* = the quote, *Customer city* box on the right. Publish. To control the order, use **Order** in the *Page Attributes* box (small numbers first). Until you add one, three sample quotes from the design are shown.

### 11.6 Add FAQs
1. **FAQs > FAQ categories**: add *Orders*, *Shipping*, etc.
2. **FAQs > Add New**: *Title* = the question, *content* = the answer, tick a category, Publish.

### 11.7 Publish About and policy pages
**Pages > Add New**. The **slug** (the URL ending) must be exactly:

| Page | Slug | Shown at |
|---|---|---|
| About | `about` | `/about` |
| Returns and refund policy | `returns` | `/policies/returns` |
| Shipping policy | `shipping` | `/policies/shipping` |
| Privacy | `privacy` | `/policies/privacy` |
| Terms | `terms` | `/policies/terms` |

To set the slug: in the page editor open the right panel, **Summary > Slug** (or the *Permalink* field).
For policy pages, use **Heading 2** blocks for section titles; the "On this page" list on the left is built automatically from them.

### 11.0 The demo content already added to WordPress
So the demo looks complete, a one-time script filled WordPress with Aurelo content (you can see it all in the dashboard):
* **27 products** (13 new Aurelo products plus 14 of the old WooCommerce demo products edited to fit the brand), each with a photo, a gallery image, price, stock and description. **8 are on sale**, one is **sold out** (Wool Scarf), a few have **low stock**. Clothing and footwear are **variable products** with a **Size** picker.
* **Categories** Clothing, Women, Men, Footwear, Accessories, Lifestyle (with descriptions and pictures).
* **Reviews** on four products, **3 testimonials**, **8 FAQs** in 4 categories, **5 pages** (about, returns, shipping, privacy, terms), the **header and footer menus**, and the **Home hero, promo and Journal images** in Aurelo Content.
* The WordPress sample items "WordPress Pennant", "Logo Collection", "Single" and "Album" were set to **Draft** (hidden, not deleted). Publish them again from Products if you want them back.
* Every product has two **illustrations that match its title** (a main picture and a detail picture). Replace them with real photography under **Products > edit > Product image**.
* The script is kept in `wordpress/seed/` for reference. It is **not** active in WordPress any more.

### 11.0b Star ratings and size-based prices
* **Stars:** every product now has 2 to 4 customer reviews, so stars show on the product cards, on the product page and in the Reviews tab. Stars are filled in halves (4.5 = four and a half stars). A product with no reviews shows "No reviews yet". Reviews come from WooCommerce (**Products > Reviews**); customers' average rating is calculated by WooCommerce.
* **Price follows size and quantity:** on a product page the price changes as soon as a size is chosen, and the page shows **Total = price × quantity** (the button also shows the total). Until a size is chosen, a product whose sizes cost different amounts shows **"From ₹..."**. Sold-out sizes are struck out and cannot be chosen.
* **Set a different price per size in WordPress:** Products > edit a variable product > **Variations** tab > open a size > change *Regular price* (and *Sale price*). Demo products already have this: for example Linen Overshirt is ₹3,499 in S/M, ₹3,649 in L and ₹3,799 in XL; the Leather Court Sneaker rises from ₹6,999 to ₹7,399 in the bigger UK sizes, and UK 11 is sold out.
* The one-time script that set this up is kept in `wordpress/seed/aurelo-demo-seed2.php` (not active in WordPress).

### 11.0a If the shop says "We could not load products"
This was a real bug we hit: WooCommerce only answers browsers from **approved web addresses**. `wp-content/mu-plugins/aurelo-cors.php` approves `http://localhost:5173` (dev) and `http://localhost:4173` (preview). If your React site runs on another address or port, add it to that file, and add your real site address before going live.

### 11.8 Images: what shows when WordPress has no picture
Every image slot uses **your WordPress image first**. If none is set, a demo photo from `public/demo/` is shown so the site never looks empty. The demo pictures are **illustrations drawn for Aurelo** in the brand colours (shirt, hoodie, trousers, dress, sneaker, boot, tote, belt, mug, candle...), so each image matches its product title. They are saved in the project and sized to the ratios the brand guide asks for.

| Spot | Ratio | Replace it in WordPress |
|---|---|---|
| Home hero | 4:5 (1200 × 1500) | Aurelo Content > Home: hero > Hero image |
| Home promo banner | 7:5 (1400 × 1000) | Aurelo Content > Home: promo banner > Promo image |
| Home Journal block | 4:3 (1200 × 900) | Aurelo Content > Home: editorial > Editorial image |
| Category cards and category page banner | 3:4 cards, 16:9 banner | Products > Categories > Thumbnail |
| Product photos | 4:5 | Products > edit product > Product image (and gallery) |
| About page photos | 4:3 and 3:4 | Create the WordPress page "About" (its content replaces the designed layout) |
| Instagram tiles on Home | 1:1 | Demo photos only (no WordPress field) |

To change a demo photo itself, replace the file in `public/demo/` (keep the same name and size) or edit `src/lib/demoImages.js`.

> These are illustrations, not photography. Replace them with real product photography before showing anything as a finished brand.

---

## 12. What WordPress handles and what React handles

**The rule we follow:** *React shows things and collects input. WordPress stores data, applies the rules and sends the emails.*

| Job | Done by React (front end) | Done by WordPress (back end) |
|---|---|---|
| Products, prices, stock, images | Draws the cards, filters, product page | Stores and serves them (WooCommerce) |
| Cart | Buttons, quantity steppers, totals display | **Keeps the cart**, checks stock, applies coupons, works out totals |
| Shipping prices | Shows the options | **Calculates** them from your WooCommerce shipping zones |
| Checkout and orders | The form and validation messages | **Creates the order**, reduces stock, sends order emails |
| Login, sign-up, password reset | The forms | **Creates users**, checks passwords, sends the reset email |
| Customer orders and profile | Account screens | **Stores** them (WooCommerce customers) |
| Contact form | The form | **Saves** it (Messages) and **emails** the admin |
| Newsletter | The sign-up box | **Saves** emails (Subscribers) |
| Text, banners, menus | Displays them | You edit them in the dashboard |
| Wishlist | Hearts + page | Nothing (kept in the visitor's own browser, no account needed) |

### 12.1 How the cart works (so you can trust it)
1. The first time the site asks for the cart, WordPress creates one and returns a **Cart-Token** (a signed ID).
2. React saves the token in the browser (`localStorage`, key `aurelo_cart_token`) and sends it with every cart request (`src/api/cart.js`).
3. Every action (add, change quantity, remove, coupon) is sent to WooCommerce, which returns the updated cart. React just displays it.
4. Header cart number = number of items in that server cart.

### 12.2 How checkout works
1. React collects email, name, phone and address and **validates** them (message beside each field).
2. When the state and PIN code are filled in, React tells WooCommerce the address; WooCommerce answers with the **shipping options** and prices.
3. On **Place order**, React sends the address + payment method to the WooCommerce Store API (`POST /wc/store/v1/checkout`).
4. WooCommerce creates the order and clears the cart. React opens `/order-success` which loads that order.
5. If you are logged in, the order is attached to your account (the React site sends your login token with the checkout request). **My orders** also lists any earlier order placed with the same email address, so guest orders are not lost after you register or log in.

> **Payments are DEMO only.** This project is shown to a client as a demo, so a third WordPress file, `aurelo-demo-payments.php`, adds four fake payment methods: **UPI, Credit/debit card, Netbanking and Cash on delivery**. They work out of the box (no WooCommerce setup needed). UPI, card and netbanking mark the order **paid** instantly; Cash on delivery marks it **processing**. **No money moves and no card details are read or stored** (the card/UPI/bank boxes on the page are for show and are never sent). To go live, delete that file and install a real gateway (for example Razorpay) in WooCommerce.

### 12.3 How login works
* `POST /wp-json/aurelo/v1/auth/login` checks the email and password with WordPress and returns a **signed token** valid for 14 days.
* React keeps it in the browser (`aurelo_auth_token`) and sends it as `Authorization: Bearer ...` for account requests.
* Account screens redirect to `/login` when there is no valid token. Logout simply deletes the token.
* Use **HTTPS** on a live site, because passwords travel in the request.

### 12.4 Still design-only or limited (honest list)
* **Payments are fake by design** (demo mode, see 12.2). Replace with a real gateway before any live use.
* **Password reset**: the email is sent by WordPress and the link opens WordPress's own "choose new password" page, then the customer logs in on the React site.
* **Email verification** after sign-up is not used (accounts work immediately). The old `verify-email`, `email-verified` and `reset-password` design screens were removed.
* **Saved-for-later and multiple addresses** are not built; one address is saved on the profile.
* **Colour and size filters** on the Shop sidebar were removed (WooCommerce attribute data not set up). Category, price, availability and sort work.
* **Size/colour chips** on a product show for *variable* products (the CSV products are *simple*, so sizes are under Specifications).
* **Instagram tiles and the contact Map** are placeholders.
* **Mobile menu** is a simple dropdown, not the drawer from the design.
* Menu items without a designed page: *Journal*, *Careers* go to `/about`; *Stores* to `/contact`; *Size guide* to `/faq`.
* The WooCommerce **demo products** (hoodies, "WordPress Pennant") are still in your shop until you trash them (see 11.1).

---

## 12A. Speed and code quality (optimisation)

What was done to keep the site light and the code tidy:

| Area | What we did | Why it helps |
|---|---|---|
| **Code splitting** | Every page is loaded on demand with `React.lazy` (`src/App.jsx`) | The first visit went from about **387 KB** of JavaScript to about **8 KB** for the starting file (the rest loads as needed) |
| **Library chunks** | `vite.config.js` puts React, the data libraries and the HTML cleaner in separate files | Browsers cache them between visits and between releases |
| **Fonts** | Loaded from `index.html` with `preconnect` + `preload` instead of a CSS `@import` | Text appears sooner (no waiting for CSS to discover fonts) |
| **Images** | Every image has a width and height (no layout jumping), a demo fallback, and product photos use `srcset` + `sizes`, `loading="lazy"` and `decoding="async"` | Phones download small images; images below the fold wait |
| **Caching of data** | React Query remembers answers (30 s for products, 5 min for categories) and shows old data while refreshing | Back/forward navigation is instant and the server is asked less |
| **Fewer requests** | One request (`/aurelo/v1/site`) returns all site settings and menus | Header, footer, announcement and Home share it |
| **Memoised cards** | `ProductCard` is wrapped in `React.memo` | Lists do less re-drawing |
| **Unused code removed** | Deleted unused starter images, the `lucide-react` package, design-only pages and old duplicates | Smaller project, nothing dead to maintain |
| **One place for each job** | API calls in `src/api`, helpers in `src/lib`, shared pieces in `src/components`, no inline styles | Easy to find and change things |
| **Safe by default** | HTML from WordPress is cleaned (DOMPurify); contact form has a honeypot and a rate limit; login/register/newsletter are rate limited; passwords never stored in React | Protects against spam and script injection |
| **Accessible** | Labels on form fields, `aria-` attributes on buttons, error messages announced (`role="alert"`), keyboard-friendly | Works with screen readers |

Check it any time: `npm run lint` (code rules) and `npm run build` (shows the size of every file).

---

## 13. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Page is blank or shows "We could not load products" | Local is not running or the WordPress site is stopped. Start the site in Local. Open `http://headless-ecommerce.local/wp-json/` to check. |
| Texts on Home are empty | `/wp-json/aurelo/v1/site` is not answering. Check that `wp-content/mu-plugins/aurelo-headless.php` exists. |
| I changed something in WordPress but the site did not change | Refresh the React page. Answers are remembered for about 30 seconds (300 seconds for categories). |
| "We could not load products" or a "CORS" error in the browser console | WordPress blocked the front-end address. Add it to `wp-content/mu-plugins/aurelo-cors.php` (see 11.0a), and check `.env` has the exact WordPress address. Restart `npm run dev`. |
| Changed `.env` but nothing happened | Stop `npm run dev` (Ctrl+C) and start it again. |
| A policy page says "not published yet" | Create a WordPress **Page** with the exact slug from section 11.7 and Publish it. |
| Menu links go to the wrong page | In **Appearance > Menus** use *Product categories* items or custom links like `/shop`. The site translates WordPress category addresses to `/category/...`. |
| Prices look like ₹2 | These are the WooCommerce demo products. Import the Aurelo CSV or set real prices. |
| Cart does nothing / "Cannot reach the store" | WordPress is stopped, or `VITE_WP_URL` is wrong. Open `/wp-json/wc/store/v1/cart` in the browser to check. |
| Checkout says no payment method | Check that `wp-content/mu-plugins/aurelo-demo-payments.php` exists (it provides the demo methods) and that WooCommerce is active. |
| My orders is empty after ordering | You must be logged in with the **same email** used at checkout. Orders placed as a guest with that email are added to the account the next time you open My orders. |
| Checkout says a state/PIN code is invalid | Choose the state from the list; the PIN code must be 6 digits. |
| Cannot log in after registering on WordPress directly | Use the email address (not the username) on the React login form. |
| Contact form "sent" but no email arrives | The message is always saved under **Messages**. Local sites cannot send email; install an SMTP plugin for real delivery. |
| `npm run dev` fails | Run `npm install` first. Check Node is installed with `node -v`. |

---

## 14. Where to go next
1. **Real payments**: remove `aurelo-demo-payments.php`, install a gateway plugin (Razorpay, PayU...) and list it on the checkout page.
2. **Variable products**: add colour/size variations in WooCommerce, then bring back the Shop colour/size filters.
3. **Order tracking**: add a tracking number field to orders and show it on the order details.
4. **Emails**: install an SMTP plugin so order, reset-password and contact emails are delivered reliably.
5. **Go live**: put WordPress on a real HTTPS address, update `VITE_WP_URL`, allow that origin in WordPress, and deploy the `dist` folder.

---

*Everything in this document describes the project as it exists now. If you change something big, update this file too.*


> **Demo test account:** `demo@example.com` / `Demo@12345` (created while testing; it owns test orders #63 and #467). Delete it under Users and the orders under WooCommerce > Orders when you no longer need them.
