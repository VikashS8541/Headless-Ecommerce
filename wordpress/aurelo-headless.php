<?php
/**
 * Plugin Name: Aurelo Headless
 * Description: Content controls for the Aurelo React storefront. Adds the "Aurelo Content" admin screen,
 *              Testimonials, FAQs, menu locations, and one public REST endpoint (/wp-json/aurelo/v1/site).
 * Version:     1.0.0
 *
 * This is a "must-use" plugin: WordPress loads it automatically, no activation needed.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * 1. The fields shown on Aurelo Content (key => label, type, default)
 *    type: text | textarea | url | image
 * ---------------------------------------------------------------------- */
function aurelo_fields() {
	return array(
		'Announcement bar' => array(
			'announcement_text' => array( 'Announcement text', 'text', 'Free shipping across India on orders above ₹2,999 · Easy 15-day returns' ),
		),
		'Home: hero' => array(
			'hero_eyebrow'    => array( 'Small label', 'text', 'Autumn / Winter 2026' ),
			'hero_title'      => array( 'Headline', 'text', 'Considered pieces for every day.' ),
			'hero_text'       => array( 'Sub text', 'textarea', 'Natural fabrics, quiet colours and cuts that last beyond the season. Designed in Jaipur.' ),
			'hero_cta1_label' => array( 'Primary button text', 'text', 'Shop new arrivals' ),
			'hero_cta1_link'  => array( 'Primary button link', 'url', '/shop' ),
			'hero_cta2_label' => array( 'Second button text', 'text', 'Explore the edit' ),
			'hero_cta2_link'  => array( 'Second button link', 'url', '/category/lifestyle' ),
			'hero_image'      => array( 'Hero image', 'image', '' ),
		),
		'Home: promo banner' => array(
			'promo_overline'   => array( 'Small label', 'text', 'Limited offer' ),
			'promo_title'      => array( 'Headline', 'text', 'Autumn edit, up to 30% off' ),
			'promo_text'       => array( 'Sub text', 'textarea', 'Linen, suede and wool pieces in the season’s quietest colours. Offer ends 30 November.' ),
			'promo_cta_label'  => array( 'Button text', 'text', 'Shop the sale' ),
			'promo_cta_link'   => array( 'Button link', 'url', '/category/sale' ),
			'promo_image'      => array( 'Promo image', 'image', '' ),
		),
		'Home: editorial (Journal)' => array(
			'editorial_overline'  => array( 'Small label', 'text', 'The Journal' ),
			'editorial_title'     => array( 'Headline', 'text', 'Slow mornings, soft layers' ),
			'editorial_text'      => array( 'Text', 'textarea', 'How three Jaipur makers turn washed linen and merino into pieces that get better with wear. A short read on materials, mending and making things last.' ),
			'editorial_cta_label' => array( 'Button text', 'text', 'Read the story' ),
			'editorial_cta_link'  => array( 'Button link', 'url', '/about' ),
			'editorial_image'     => array( 'Editorial image', 'image', '' ),
		),
		'Home: benefits (4 items)' => array(
			'benefit1_title' => array( 'Benefit 1 title', 'text', 'Free shipping' ),
			'benefit1_text'  => array( 'Benefit 1 text', 'text', 'On every order above ₹2,999 across India.' ),
			'benefit2_title' => array( 'Benefit 2 title', 'text', '15-day returns' ),
			'benefit2_text'  => array( 'Benefit 2 text', 'text', 'Easy exchanges and refunds, no questions.' ),
			'benefit3_title' => array( 'Benefit 3 title', 'text', 'Secure payments' ),
			'benefit3_text'  => array( 'Benefit 3 text', 'text', 'UPI, cards, netbanking and cash on delivery.' ),
			'benefit4_title' => array( 'Benefit 4 title', 'text', 'Made to last' ),
			'benefit4_text'  => array( 'Benefit 4 text', 'text', 'Natural fibres and responsibly made.' ),
		),
		'Home: newsletter' => array(
			'newsletter_title' => array( 'Headline', 'text', 'Get 10% off your first order' ),
			'newsletter_text'  => array( 'Text', 'text', 'First looks, restocks and member offers. No spam, unsubscribe anytime.' ),
		),
		'Footer' => array(
			'footer_about'      => array( 'About text', 'textarea', 'Considered everyday wear, footwear and home pieces. Designed in Jaipur, made to last.' ),
			'instagram_handle'  => array( 'Instagram handle', 'text', '@aurelo.india' ),
			'copyright'         => array( 'Copyright line', 'text', '© 2026 Aurelo Lifestyle Pvt. Ltd.' ),
			'payment_text'      => array( 'Payment methods line', 'text', 'UPI · Visa · Mastercard · RuPay · COD' ),
			'footer_shop_title'    => array( 'Column 1 title (menu: Footer: Shop)', 'text', 'Shop' ),
			'footer_help_title'    => array( 'Column 2 title (menu: Footer: Help)', 'text', 'Help' ),
			'footer_company_title' => array( 'Column 3 title (menu: Footer: Company)', 'text', 'Company' ),
			'footer_news_title'    => array( 'Newsletter title', 'text', 'Get 10% off' ),
			'footer_news_text'     => array( 'Newsletter text', 'text', 'Join the list for first looks and member offers.' ),
		),
		'Contact details' => array(
			'contact_address' => array( 'Address (use a new line for each row)', 'textarea', "Aurelo Lifestyle Pvt. Ltd.\n22 Bapu Bazaar Road, Jaipur 302003" ),
			'contact_email'   => array( 'Email', 'text', 'care@aurelo.example' ),
			'contact_phone'   => array( 'Phone and hours (new line for each row)', 'textarea', "+91 141 400 0000\nMon–Sat, 10:00–19:00 IST" ),
		),
		'Empty and error pages' => array(
			'notfound_code'       => array( '404 page: big number', 'text', '404' ),
			'notfound_title'      => array( '404 page: headline', 'text', 'This page has wandered off' ),
			'notfound_text'       => array( '404 page: text', 'text', 'The link may be old or the page may have moved. Try a search or head back to the shop.' ),
			'notfound_btn1'       => array( '404 page: first button (goes to home)', 'text', 'Back to home' ),
			'notfound_btn2'       => array( '404 page: second button (goes to shop)', 'text', 'Shop new arrivals' ),
			'cart_empty_title'    => array( 'Empty cart: headline', 'text', 'Your cart is empty' ),
			'cart_empty_text'     => array( 'Empty cart: text', 'text', 'Add a few pieces and they will appear here.' ),
			'cart_empty_button'   => array( 'Empty cart: button (goes to shop)', 'text', 'Continue shopping' ),
			'wishlist_title'        => array( 'Wishlist page: headline', 'text', 'My wishlist' ),
			'wishlist_empty_title'  => array( 'Empty wishlist: headline', 'text', 'Nothing saved yet' ),
			'wishlist_empty_text'   => array( 'Empty wishlist: text', 'text', 'Tap the heart on any piece to keep it here.' ),
			'wishlist_empty_button' => array( 'Empty wishlist: button (goes to shop)', 'text', 'Explore new arrivals' ),
			'search_empty_title'  => array( 'No search results: headline (use {query} for the word searched)', 'text', 'No results for “{query}”' ),
			'search_empty_text'   => array( 'No search results: text', 'text', 'Check the spelling or try a shorter word.' ),
			'search_empty_button' => array( 'No search results: button (goes to shop)', 'text', 'Explore new arrivals' ),
			'orders_empty_title'  => array( 'No orders: headline', 'text', 'No orders yet' ),
			'orders_empty_text'   => array( 'No orders: text', 'text', 'When you place an order it will show up here.' ),
			'orders_empty_button' => array( 'No orders: button (goes to shop)', 'text', 'Start shopping' ),
		),
		'Brand (header and footer logo)' => array(
			'logo_text'  => array( 'Logo text', 'text', 'Aurelo' ),
			'logo_image' => array( 'Logo image (optional, shown instead of the text)', 'image', '' ),
		),
		'Home: section headings' => array(
			'home_view_all'       => array( '"View all" link text', 'text', 'View all' ),
			'home_cat_overline'   => array( 'Categories: small label', 'text', 'Shop by category' ),
			'home_cat_title'      => array( 'Categories: headline', 'text', 'Find your way in' ),
			'home_cat_link'       => array( 'Categories: link text', 'text', 'All categories' ),
			'new_overline'        => array( 'New arrivals: small label', 'text', 'New arrivals' ),
			'new_title'           => array( 'New arrivals: headline', 'text', 'Just landed' ),
			'best_overline'       => array( 'Best sellers: small label', 'text', 'Best sellers' ),
			'best_title'          => array( 'Best sellers: headline', 'text', 'Most loved this season' ),
			'trend_overline'      => array( 'Trending: small label', 'text', 'Trending' ),
			'trend_title'         => array( 'Trending: headline', 'text', 'What everyone is wearing' ),
			'testi_overline'      => array( 'Testimonials: small label', 'text', 'Customers' ),
			'testi_title'         => array( 'Testimonials: headline', 'text', 'Kind words' ),
			'newsletter_overline' => array( 'Newsletter: small label', 'text', 'Newsletter' ),
			'insta_overline'      => array( 'Instagram: small label', 'text', 'Instagram' ),
			'insta1_image'        => array( 'Instagram picture 1', 'image', '' ),
			'insta2_image'        => array( 'Instagram picture 2', 'image', '' ),
			'insta3_image'        => array( 'Instagram picture 3', 'image', '' ),
			'insta4_image'        => array( 'Instagram picture 4', 'image', '' ),
			'insta5_image'        => array( 'Instagram picture 5', 'image', '' ),
			'insta6_image'        => array( 'Instagram picture 6', 'image', '' ),
		),
		'Shop page' => array(
			'shop_title' => array( 'Headline', 'text', 'All products' ),
			'shop_text'  => array( 'Sub text', 'textarea', 'Natural fabrics, quiet colours and pieces made to last.' ),
		),
		'Product page' => array(
			'product_note1'         => array( 'Highlight line 1', 'text', 'Free delivery on orders above ₹2,999' ),
			'product_note2'         => array( 'Highlight line 2', 'text', 'Free 15-day returns and exchanges' ),
			'product_shipping_text' => array( 'Shipping and returns tab (new line for each paragraph)', 'textarea', "Standard delivery takes 3–5 working days across India; Express takes 1–2 working days in metro cities.\nFree shipping on orders above ₹2,999. Easy 15-day returns and exchanges." ),
		),
		'Cart' => array(
			'free_shipping_threshold' => array( 'Free shipping above (amount in rupees; leave empty to hide the progress bar)', 'text', '2999' ),
		),
		'Contact page' => array(
			'contact_overline' => array( 'Small label', 'text', 'Contact' ),
			'contact_title'    => array( 'Headline', 'text', 'We are here to help' ),
			'contact_text'     => array( 'Sub text', 'textarea', 'Questions about an order, sizing or a repair? Write to us and we reply within one working day.' ),
		),
		'FAQ page' => array(
			'faq_title' => array( 'Headline', 'text', 'Frequently asked questions' ),
			'faq_text'  => array( 'Sub text', 'text', 'Can’t find an answer? Write to us from the Contact page.' ),
		),
		'About page' => array(
			'about_overline'        => array( 'Small label', 'text', 'Our story' ),
			'about_title'           => array( 'Headline', 'text', 'Made slowly, worn for years.' ),
			'about_text'            => array( 'Sub text', 'textarea', 'Aurelo began in a Jaipur workshop in 2019 with one linen shirt and a belief that everyday clothes should last longer than the trend that sold them.' ),
			'about_image'           => array( 'Top image', 'image', '' ),
			'about_values_overline' => array( 'Values: small label', 'text', 'Mission and values' ),
			'about_values_title'    => array( 'Values: headline', 'text', 'What we stand for' ),
			'about_v1_title'        => array( 'Value 1 title', 'text', 'Natural first' ),
			'about_v1_text'         => array( 'Value 1 text', 'text', 'Linen, wool, cotton and leather from vetted mills.' ),
			'about_v2_title'        => array( 'Value 2 title', 'text', 'Honest pricing' ),
			'about_v2_text'         => array( 'Value 2 text', 'text', 'One fair price, no inflated markdowns.' ),
			'about_v3_title'        => array( 'Value 3 title', 'text', 'Made to be mended' ),
			'about_v3_text'         => array( 'Value 3 text', 'text', 'Free repairs for the first two years.' ),
			'about_s1_value'        => array( 'Number 1: value', 'text', '2019' ),
			'about_s1_label'        => array( 'Number 1: label', 'text', 'Founded in Jaipur' ),
			'about_s2_value'        => array( 'Number 2: value', 'text', '1.2L+' ),
			'about_s2_label'        => array( 'Number 2: label', 'text', 'Pieces sold' ),
			'about_s3_value'        => array( 'Number 3: value', 'text', '420' ),
			'about_s3_label'        => array( 'Number 3: label', 'text', 'Cities delivered to' ),
			'about_s4_value'        => array( 'Number 4: value', 'text', '4.7' ),
			'about_s4_label'        => array( 'Number 4: label', 'text', 'Average rating' ),
			'about_gallery1'        => array( 'Gallery picture 1 (wide)', 'image', '' ),
			'about_gallery2'        => array( 'Gallery picture 2', 'image', '' ),
			'about_gallery3'        => array( 'Gallery picture 3', 'image', '' ),
			'about_cta_title'       => array( 'Closing headline', 'text', 'Start with the pieces people re-order.' ),
			'about_cta_label'       => array( 'Closing button text', 'text', 'Shop best sellers' ),
			'about_cta_link'        => array( 'Closing button link', 'url', '/shop' ),
		),
	);
}

function aurelo_defaults() {
	$out = array();
	foreach ( aurelo_fields() as $group ) {
		foreach ( $group as $key => $f ) {
			$out[ $key ] = $f[2];
		}
	}
	return $out;
}

/**
 * What the admin saved, and nothing else. A box left empty stays empty (the storefront hides it).
 * Only a field that was never saved (a brand-new field) starts with its suggested text.
 */
function aurelo_get_options() {
	$saved = get_option( 'aurelo_options', array() );
	$saved = is_array( $saved ) ? $saved : array();
	$out   = array();
	foreach ( aurelo_fields() as $group ) {
		foreach ( $group as $key => $f ) {
			$out[ $key ] = array_key_exists( $key, $saved ) ? $saved[ $key ] : $f[2];
		}
	}
	return $out;
}

/* -------------------------------------------------------------------------
 * 2. Admin screen: Aurelo Content
 * ---------------------------------------------------------------------- */
add_action( 'admin_menu', function () {
	add_menu_page( 'Aurelo Content', 'Aurelo Content', 'manage_options', 'aurelo-content', 'aurelo_render_page', 'dashicons-layout', 3 );
} );

add_action( 'admin_init', function () {
	register_setting( 'aurelo_group', 'aurelo_options', array(
		'sanitize_callback' => function ( $input ) {
			$clean = array();
			foreach ( aurelo_fields() as $group ) {
				foreach ( $group as $key => $f ) {
					$val = isset( $input[ $key ] ) ? wp_unslash( $input[ $key ] ) : '';
					if ( 'textarea' === $f[1] ) {
						$clean[ $key ] = sanitize_textarea_field( $val );
					} elseif ( 'image' === $f[1] ) {
						$clean[ $key ] = absint( $val );
					} elseif ( 'url' === $f[1] ) {
						// Keep relative links such as /shop as they are.
						$clean[ $key ] = 0 === strpos( $val, '/' ) ? sanitize_text_field( $val ) : esc_url_raw( $val );
					} else {
						$clean[ $key ] = sanitize_text_field( $val );
					}
				}
			}
			return $clean;
		},
	) );
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'toplevel_page_aurelo-content' === $hook ) {
		wp_enqueue_media();
	}
} );

function aurelo_render_page() {
	$opts = aurelo_get_options();
	?>
	<div class="wrap">
		<h1>Aurelo Content</h1>
		<p>Everything here shows up on the React storefront. Leave a box empty and that part is hidden on the site.
			Links can be a page on the shop such as <code>/shop</code> or <code>/category/sale</code>.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'aurelo_group' ); ?>
			<?php foreach ( aurelo_fields() as $group_name => $fields ) : ?>
				<h2 style="margin-top:2em"><?php echo esc_html( $group_name ); ?></h2>
				<table class="form-table" role="presentation">
					<?php foreach ( $fields as $key => $f ) :
						$name = 'aurelo_options[' . $key . ']';
						$val  = isset( $opts[ $key ] ) ? $opts[ $key ] : '';
						?>
						<tr>
							<th scope="row"><label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $f[0] ); ?></label></th>
							<td>
								<?php if ( 'textarea' === $f[1] ) : ?>
									<textarea id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $name ); ?>" rows="3" class="large-text"><?php echo esc_textarea( $val ); ?></textarea>
								<?php elseif ( 'image' === $f[1] ) :
									$id    = isset( $opts[ $key ] ) ? absint( $opts[ $key ] ) : 0;
									$url   = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
									?>
									<div class="aurelo-image" data-key="<?php echo esc_attr( $key ); ?>">
										<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $id ); ?>" />
										<img src="<?php echo esc_url( $url ); ?>" style="max-width:200px;display:<?php echo $url ? 'block' : 'none'; ?>;margin-bottom:8px" alt="" />
										<button type="button" class="button aurelo-pick">Choose image</button>
										<button type="button" class="button-link aurelo-clear">Remove</button>
									</div>
								<?php else : ?>
									<input type="text" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $val ); ?>" class="large-text" />
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endforeach; ?>
			<?php submit_button( 'Save changes' ); ?>
		</form>
	</div>
	<script>
	jQuery(function ($) {
		$('.aurelo-image').each(function () {
			var box = $(this), input = box.find('input'), img = box.find('img');
			box.find('.aurelo-pick').on('click', function () {
				var frame = wp.media({ title: 'Choose image', multiple: false });
				frame.on('select', function () {
					var a = frame.state().get('selection').first().toJSON();
					input.val(a.id);
					img.attr('src', (a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url)).show();
				});
				frame.open();
			});
			box.find('.aurelo-clear').on('click', function () { input.val(''); img.hide(); });
		});
	});
	</script>
	<?php
}

/* -------------------------------------------------------------------------
 * 3. Testimonials and FAQs (custom content types, readable by the REST API)
 * ---------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'testimonial', array(
		'labels'       => array( 'name' => 'Testimonials', 'singular_name' => 'Testimonial', 'add_new_item' => 'Add testimonial', 'edit_item' => 'Edit testimonial' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'testimonials',
		'menu_icon'    => 'dashicons-format-quote',
		'menu_position'=> 4,
		'supports'     => array( 'title', 'editor', 'page-attributes' ),
	) );
	register_post_meta( 'testimonial', 'city', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field' ) );

	register_post_type( 'aurelo_faq', array(
		'labels'       => array( 'name' => 'FAQs', 'singular_name' => 'FAQ', 'add_new_item' => 'Add FAQ', 'edit_item' => 'Edit FAQ' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'faqs',
		'menu_icon'    => 'dashicons-editor-help',
		'menu_position'=> 5,
		'supports'     => array( 'title', 'editor', 'page-attributes' ),
		'taxonomies'   => array( 'faq_category' ),
	) );
	register_taxonomy( 'faq_category', 'aurelo_faq', array(
		'labels'       => array( 'name' => 'FAQ categories', 'singular_name' => 'FAQ category' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'faq_categories',
		'hierarchical' => true,
	) );

	register_nav_menus( array(
		'primary'        => 'Primary (header)',
		'footer_shop'    => 'Footer: Shop',
		'footer_help'    => 'Footer: Help',
		'footer_company' => 'Footer: Company',
		'footer_legal'   => 'Footer: Legal (bottom line)',
	) );
} );

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'aurelo_city', 'Customer city', function ( $post ) {
		echo '<input type="text" name="aurelo_city" value="' . esc_attr( get_post_meta( $post->ID, 'city', true ) ) . '" class="widefat" placeholder="Mumbai" />';
		echo '<p class="description">Title = customer name. Content = the quote.</p>';
	}, 'testimonial', 'side' );
} );

add_action( 'save_post_testimonial', function ( $post_id ) {
	if ( isset( $_POST['aurelo_city'] ) ) {
		update_post_meta( $post_id, 'city', sanitize_text_field( wp_unslash( $_POST['aurelo_city'] ) ) );
	}
} );

/* -------------------------------------------------------------------------
 * 4. REST endpoint: options + menus in one request
 * ---------------------------------------------------------------------- */
function aurelo_menu( $location ) {
	$locations = get_nav_menu_locations();
	if ( empty( $locations[ $location ] ) ) {
		return null;
	}
	$items = wp_get_nav_menu_items( $locations[ $location ] );
	if ( ! $items ) {
		return array();
	}
	return array_map( function ( $i ) {
		return array(
			'id'     => (int) $i->ID,
			'parent' => (int) $i->menu_item_parent,
			'title'  => $i->title,
			'url'    => $i->url,
		);
	}, $items );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'aurelo/v1', '/site', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$opts = aurelo_get_options();
			foreach ( aurelo_fields() as $group ) {
				foreach ( $group as $key => $f ) {
					if ( 'image' === $f[1] ) {
						$id            = isset( $opts[ $key ] ) ? absint( $opts[ $key ] ) : 0;
						$opts[ $key ] = $id ? wp_get_attachment_image_url( $id, 'full' ) : '';
					}
				}
			}
			return array(
				'options' => $opts,
				'menus'   => array(
					'primary'        => aurelo_menu( 'primary' ),
					'footer_shop'    => aurelo_menu( 'footer_shop' ),
					'footer_help'    => aurelo_menu( 'footer_help' ),
					'footer_company' => aurelo_menu( 'footer_company' ),
					'footer_legal'   => aurelo_menu( 'footer_legal' ),
				),
			);
		},
	) );
} );
