<?php
/**
 * Plugin Name: Aurelo Headless: forms and customer accounts
 * Description: REST endpoints used by the React storefront for the contact form, newsletter,
 *              customer login/registration, profile and order history. Loaded automatically (mu-plugin).
 * Version:     1.0.0
 *
 * All endpoints live under /wp-json/aurelo/v1/ . Cart and checkout use WooCommerce's own Store API.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * 1. Where contact messages and newsletter sign-ups are stored (visible in wp-admin)
 * ---------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'aurelo_message', array(
		'labels'       => array( 'name' => 'Messages', 'singular_name' => 'Message', 'menu_name' => 'Messages' ),
		'public'       => false,
		'show_ui'      => true,
		'menu_icon'    => 'dashicons-email-alt',
		'menu_position'=> 6,
		'supports'     => array( 'title', 'editor' ),
		'capability_type' => 'post',
		'capabilities' => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap' => true,
	) );
	register_post_type( 'aurelo_subscriber', array(
		'labels'       => array( 'name' => 'Subscribers', 'singular_name' => 'Subscriber', 'menu_name' => 'Subscribers' ),
		'public'       => false,
		'show_ui'      => true,
		'menu_icon'    => 'dashicons-groups',
		'menu_position'=> 7,
		'supports'     => array( 'title' ),
		'capabilities' => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap' => true,
	) );
} );

/** Allow at most $max requests per hour from one visitor for an action. */
function aurelo_rate_limited( $action, $max = 8 ) {
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'x';
	$key = 'aurelo_rl_' . md5( $action . $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= $max ) {
		return true;
	}
	set_transient( $key, $n + 1, HOUR_IN_SECONDS );
	return false;
}

/* -------------------------------------------------------------------------
 * 2. Login tokens (signed, expire after 7 days, stop working when the password changes)
 * ---------------------------------------------------------------------- */
function aurelo_b64( $s ) {
	return rtrim( strtr( base64_encode( $s ), '+/', '-_' ), '=' );
}
function aurelo_unb64( $s ) {
	return base64_decode( strtr( $s, '-_', '+/' ) );
}
/** Short fingerprint of the current password, so changing the password signs every old token out. */
function aurelo_pw_stamp( $user_id ) {
	$u = get_userdata( (int) $user_id );
	return $u ? substr( hash_hmac( 'sha256', $u->user_pass, wp_salt( 'auth' ) ), 0, 12 ) : '';
}
function aurelo_make_token( $user_id ) {
	$payload = aurelo_b64( wp_json_encode( array( 'u' => (int) $user_id, 'e' => time() + 7 * DAY_IN_SECONDS, 'p' => aurelo_pw_stamp( $user_id ) ) ) );
	return $payload . '.' . hash_hmac( 'sha256', $payload, wp_salt( 'auth' ) );
}
/** Returns the user id behind the "Authorization: Bearer ..." header, or 0. */
function aurelo_token_user_id() {
	$h = '';
	if ( ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
		$h = sanitize_text_field( wp_unslash( $_SERVER['HTTP_AUTHORIZATION'] ) );
	} elseif ( ! empty( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ) {
		$h = sanitize_text_field( wp_unslash( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) );
	}
	if ( 0 !== stripos( $h, 'Bearer ' ) ) {
		return 0;
	}
	$parts = explode( '.', trim( substr( $h, 7 ) ) );
	if ( 2 !== count( $parts ) ) {
		return 0;
	}
	if ( ! hash_equals( hash_hmac( 'sha256', $parts[0], wp_salt( 'auth' ) ), $parts[1] ) ) {
		return 0;
	}
	$data = json_decode( aurelo_unb64( $parts[0] ), true );
	if ( ! is_array( $data ) || empty( $data['u'] ) || empty( $data['e'] ) || $data['e'] < time() ) {
		return 0;
	}
	if ( empty( $data['p'] ) || ! hash_equals( aurelo_pw_stamp( (int) $data['u'] ), (string) $data['p'] ) ) {
		return 0;
	}
	return get_userdata( (int) $data['u'] ) ? (int) $data['u'] : 0;
}
function aurelo_require_user() {
	$id = aurelo_token_user_id();
	return $id ? $id : new WP_Error( 'aurelo_auth', 'Please log in.', array( 'status' => 401 ) );
}

function aurelo_user_payload( $user_id ) {
	$u = get_userdata( $user_id );
	$c = new WC_Customer( $user_id );
	return array(
		'id'         => (int) $user_id,
		'email'      => $u->user_email,
		'first_name' => $c->get_first_name(),
		'last_name'  => $c->get_last_name(),
		'name'       => trim( $c->get_first_name() . ' ' . $c->get_last_name() ) ?: $u->display_name,
		'phone'      => $c->get_billing_phone(),
		'since'      => $u->user_registered,
		'address'    => array(
			'address_1' => $c->get_billing_address_1(),
			'city'      => $c->get_billing_city(),
			'state'     => $c->get_billing_state(),
			'postcode'  => $c->get_billing_postcode(),
			'country'   => $c->get_billing_country(),
		),
	);
}

/* Orders made at checkout while logged in belong to the customer's account. */
add_action( 'woocommerce_store_api_checkout_order_processed', function ( $order ) {
	$uid = aurelo_token_user_id();
	if ( $uid && 0 === (int) $order->get_customer_id() ) {
		$order->set_customer_id( $uid );
		$order->save();
	}
}, 10, 1 );

add_action( 'woocommerce_store_api_checkout_update_order_from_request', function ( $order ) {
	$uid = aurelo_token_user_id();
	if ( $uid ) {
		$order->set_customer_id( $uid );
	}
}, 10, 1 );

/* -------------------------------------------------------------------------
 * 3. Routes
 * ---------------------------------------------------------------------- */
add_action( 'rest_api_init', function () {
	$ns = 'aurelo/v1';

	// Contact form -> saved as a Message and e-mailed to the site admin.
	register_rest_route( $ns, '/contact', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			if ( $r->get_param( 'website' ) ) { // hidden "honeypot" field: bots fill it in
				return array( 'ok' => true );
			}
			if ( aurelo_rate_limited( 'contact' ) ) {
				return new WP_Error( 'aurelo_rate', 'Too many messages. Please try again later.', array( 'status' => 429 ) );
			}
			$name    = sanitize_text_field( $r->get_param( 'name' ) );
			$email   = sanitize_email( $r->get_param( 'email' ) );
			$phone   = sanitize_text_field( $r->get_param( 'phone' ) );
			$subject = sanitize_text_field( $r->get_param( 'subject' ) );
			$message = sanitize_textarea_field( $r->get_param( 'message' ) );
			if ( ! $name || ! is_email( $email ) || ! $message ) {
				return new WP_Error( 'aurelo_invalid', 'Enter your name, a valid email and a message.', array( 'status' => 400 ) );
			}
			$body = "From: $name <$email>\nPhone: $phone\nSubject: $subject\n\n$message";
			wp_insert_post( array(
				'post_type'    => 'aurelo_message',
				'post_status'  => 'publish',
				'post_title'   => ( $subject ? $subject : 'Message' ) . ' - ' . $name,
				'post_content' => $body,
			) );
			wp_mail( get_option( 'admin_email' ), '[Aurelo] ' . ( $subject ? $subject : 'New message' ), $body, array( 'Reply-To: ' . $email ) );
			return array( 'ok' => true );
		},
	) );

	// Newsletter
	register_rest_route( $ns, '/subscribe', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			if ( aurelo_rate_limited( 'subscribe' ) ) {
				return new WP_Error( 'aurelo_rate', 'Too many attempts. Please try again later.', array( 'status' => 429 ) );
			}
			$email = sanitize_email( $r->get_param( 'email' ) );
			if ( ! is_email( $email ) ) {
				return new WP_Error( 'aurelo_invalid', 'Enter a valid email address.', array( 'status' => 400 ) );
			}
			$exists = get_posts( array( 'post_type' => 'aurelo_subscriber', 'title' => $email, 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids' ) );
			if ( ! $exists ) {
				wp_insert_post( array( 'post_type' => 'aurelo_subscriber', 'post_status' => 'publish', 'post_title' => $email ) );
			}
			return array( 'ok' => true );
		},
	) );

	// Log in
	register_rest_route( $ns, '/auth/login', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			if ( aurelo_rate_limited( 'login', 20 ) ) {
				return new WP_Error( 'aurelo_rate', 'Too many attempts. Please try again later.', array( 'status' => 429 ) );
			}
			$user = wp_authenticate( sanitize_text_field( $r->get_param( 'email' ) ), (string) $r->get_param( 'password' ) );
			if ( is_wp_error( $user ) ) {
				return new WP_Error( 'aurelo_login', 'Incorrect email or password.', array( 'status' => 401 ) );
			}
			return array( 'token' => aurelo_make_token( $user->ID ), 'user' => aurelo_user_payload( $user->ID ) );
		},
	) );

	// Create an account
	register_rest_route( $ns, '/auth/register', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			if ( aurelo_rate_limited( 'register', 10 ) ) {
				return new WP_Error( 'aurelo_rate', 'Too many attempts. Please try again later.', array( 'status' => 429 ) );
			}
			$email = sanitize_email( $r->get_param( 'email' ) );
			$pass  = (string) $r->get_param( 'password' );
			$name  = sanitize_text_field( $r->get_param( 'name' ) );
			if ( ! is_email( $email ) ) {
				return new WP_Error( 'aurelo_invalid', 'Enter a valid email address.', array( 'status' => 400 ) );
			}
			if ( strlen( $pass ) < 8 ) {
				return new WP_Error( 'aurelo_invalid', 'Use at least 8 characters for the password.', array( 'status' => 400 ) );
			}
			if ( email_exists( $email ) ) {
				return new WP_Error( 'aurelo_exists', 'An account with this email already exists. Try logging in.', array( 'status' => 409 ) );
			}
			$parts = preg_split( '/\s+/', $name, 2 );
			$id    = wc_create_new_customer( $email, '', $pass, array( 'first_name' => $parts[0], 'last_name' => isset( $parts[1] ) ? $parts[1] : '' ) );
			if ( is_wp_error( $id ) ) {
				return new WP_Error( 'aurelo_invalid', wp_strip_all_tags( $id->get_error_message() ), array( 'status' => 400 ) );
			}
			return array( 'token' => aurelo_make_token( $id ), 'user' => aurelo_user_payload( $id ) );
		},
	) );

	// Password reset e-mail (WordPress sends the link)
	register_rest_route( $ns, '/auth/forgot', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			if ( ! aurelo_rate_limited( 'forgot', 5 ) ) {
				$login = sanitize_text_field( $r->get_param( 'email' ) );
				if ( $login ) {
					retrieve_password( $login );
				}
			}
			return array( 'ok' => true ); // same answer whether or not the account exists
		},
	) );

	// Current customer
	register_rest_route( $ns, '/me', array(
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				$id = aurelo_require_user();
				return is_wp_error( $id ) ? $id : aurelo_user_payload( $id );
			},
		),
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => function ( WP_REST_Request $r ) {
				$id = aurelo_require_user();
				if ( is_wp_error( $id ) ) {
					return $id;
				}
				$c = new WC_Customer( $id );
				foreach ( array( 'first_name', 'last_name' ) as $f ) {
					if ( null !== $r->get_param( $f ) ) {
						$c->{'set_' . $f}( sanitize_text_field( $r->get_param( $f ) ) );
					}
				}
				if ( null !== $r->get_param( 'phone' ) ) {
					$c->set_billing_phone( sanitize_text_field( $r->get_param( 'phone' ) ) );
				}
				$addr = $r->get_param( 'address' );
				if ( is_array( $addr ) ) {
					foreach ( array( 'address_1', 'city', 'state', 'postcode', 'country' ) as $f ) {
						if ( isset( $addr[ $f ] ) ) {
							$c->{'set_billing_' . $f}( sanitize_text_field( $addr[ $f ] ) );
							$c->{'set_shipping_' . $f}( sanitize_text_field( $addr[ $f ] ) );
						}
					}
				}
				$email = sanitize_email( (string) $r->get_param( 'email' ) );
				if ( $email && is_email( $email ) && get_userdata( $id )->user_email !== $email ) {
					if ( email_exists( $email ) ) {
						return new WP_Error( 'aurelo_exists', 'That email is already used by another account.', array( 'status' => 409 ) );
					}
					wp_update_user( array( 'ID' => $id, 'user_email' => $email ) );
				}
				$c->save();
				return aurelo_user_payload( $id );
			},
		),
	) );

	register_rest_route( $ns, '/me/password', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $r ) {
			$id = aurelo_require_user();
			if ( is_wp_error( $id ) ) {
				return $id;
			}
			$user = get_userdata( $id );
			if ( ! wp_check_password( (string) $r->get_param( 'current' ), $user->user_pass, $id ) ) {
				return new WP_Error( 'aurelo_pw', 'Your current password is not correct.', array( 'status' => 400 ) );
			}
			$new = (string) $r->get_param( 'new' );
			if ( strlen( $new ) < 8 ) {
				return new WP_Error( 'aurelo_pw', 'Use at least 8 characters for the new password.', array( 'status' => 400 ) );
			}
			wp_set_password( $new, $id );
			return array( 'ok' => true, 'token' => aurelo_make_token( $id ) );
		},
	) );

	// Order history
	register_rest_route( $ns, '/orders', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$id = aurelo_require_user();
			if ( is_wp_error( $id ) ) {
				return $id;
			}
			// Orders linked to the account, plus orders placed with the same email before the customer logged in
			$email  = get_userdata( $id )->user_email;
			$mine   = wc_get_orders( array( 'customer_id' => $id, 'limit' => 50, 'orderby' => 'date', 'order' => 'DESC' ) );
			$byMail = wc_get_orders( array( 'billing_email' => $email, 'limit' => 50, 'orderby' => 'date', 'order' => 'DESC' ) );
			$seen   = array();
			$orders = array();
			foreach ( array_merge( $mine, $byMail ) as $o ) {
				if ( ! isset( $seen[ $o->get_id() ] ) && 'checkout-draft' !== $o->get_status() ) {
					$seen[ $o->get_id() ] = true;
					$orders[]             = $o;
				}
			}
			usort( $orders, function ( $a, $b ) { return $b->get_date_created()->getTimestamp() - $a->get_date_created()->getTimestamp(); } );
			// Attach email-matched guest orders to the account for next time
			foreach ( $orders as $o ) {
				if ( 0 === (int) $o->get_customer_id() ) {
					$o->set_customer_id( $id );
					$o->save();
				}
			}
			return array_map( function ( $o ) {
				$items = array();
				foreach ( $o->get_items() as $it ) {
					$product = $it->get_product();
					$items[] = array(
						'name'  => $it->get_name(),
						'qty'   => $it->get_quantity(),
						'image' => $product ? wp_get_attachment_image_url( $product->get_image_id(), 'thumbnail' ) : '',
						'slug'  => $product ? $product->get_slug() : '',
					);
				}
				return array(
					'id'       => $o->get_id(),
					'number'   => $o->get_order_number(),
					'date'     => $o->get_date_created() ? $o->get_date_created()->date( 'c' ) : '',
					'status'   => $o->get_status(),
					'total'    => (float) $o->get_total(),
					'currency' => $o->get_currency(),
					'payment'  => $o->get_payment_method_title(),
					'paid'     => $o->is_paid(),
					'items'    => $items,
					'shipping' => trim( $o->get_shipping_address_1() . ', ' . $o->get_shipping_city() . ' ' . $o->get_shipping_postcode(), ' ,' ),
				);
			}, $orders );
		},
	) );
} );

/* Do not let visitors list WordPress usernames through the public REST API (/wp/v2/users). */
add_filter( 'rest_endpoints', function ( $endpoints ) {
	if ( ! is_user_logged_in() ) {
		unset( $endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
	}
	return $endpoints;
} );
