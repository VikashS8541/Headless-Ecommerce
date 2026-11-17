<?php
/**
 * Plugin Name: Aurelo Demo Payments
 * Description: DEMO ONLY. Adds fake payment methods (UPI, Card, Netbanking, Cash on delivery) so the storefront
 *              checkout can be shown to a client. No money is moved and no card details are read or stored.
 *              Remove this file and install a real gateway (Razorpay, PayU...) for a live shop.
 * Version:     1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'plugins_loaded', function () {
	if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
		return;
	}

	class Aurelo_Demo_Gateway extends WC_Payment_Gateway {
		public $paid_now = true;

		public function __construct( $id = 'aurelo_upi', $title = 'UPI (demo)', $paid_now = true ) {
			$this->id                 = $id;
			$this->method_title       = $title;
			$this->method_description = 'Demo payment method. No real payment is taken.';
			$this->title              = $title;
			$this->has_fields         = false;
			$this->enabled            = 'yes';
			$this->paid_now           = $paid_now;
			$this->supports           = array( 'products' );
		}

		public function is_available() {
			return true;
		}

		public function process_payment( $order_id ) {
			$order = wc_get_order( $order_id );
			if ( $this->paid_now ) {
				$order->payment_complete( 'DEMO-' . strtoupper( wp_generate_password( 8, false ) ) );
				$order->add_order_note( 'Demo payment accepted (' . $this->title . '). No real money was moved.' );
			} else {
				$order->update_status( 'processing', 'Cash on delivery (demo): pay when the order arrives.' );
			}
			wc_reduce_stock_levels( $order_id );
			WC()->cart->empty_cart();
			return array(
				'result'   => 'success',
				'redirect' => $this->get_return_url( $order ),
			);
		}
	}

	// One small class per method so each has its own id (the id is what React sends at checkout).
	class Aurelo_Demo_UPI extends Aurelo_Demo_Gateway { public function __construct() { parent::__construct( 'aurelo_upi', 'UPI (demo)', true ); } }
	class Aurelo_Demo_Card extends Aurelo_Demo_Gateway { public function __construct() { parent::__construct( 'aurelo_card', 'Credit / debit card (demo)', true ); } }
	class Aurelo_Demo_Netbanking extends Aurelo_Demo_Gateway { public function __construct() { parent::__construct( 'aurelo_netbanking', 'Netbanking (demo)', true ); } }
	class Aurelo_Demo_COD extends Aurelo_Demo_Gateway { public function __construct() { parent::__construct( 'aurelo_cod', 'Cash on delivery (demo)', false ); } }

	add_filter( 'woocommerce_payment_gateways', function ( $gateways ) {
		return array_merge( array( 'Aurelo_Demo_UPI', 'Aurelo_Demo_Card', 'Aurelo_Demo_Netbanking', 'Aurelo_Demo_COD' ), $gateways );
	} );
}, 20 );
