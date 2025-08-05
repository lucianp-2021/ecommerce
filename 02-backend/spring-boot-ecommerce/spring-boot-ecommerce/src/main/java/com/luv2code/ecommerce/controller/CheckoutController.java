package com.luv2code.ecommerce.controller;

import com.luv2code.ecommerce.dto.PaymentInfo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final Logger logger = LoggerFactory.getLogger(getClass().getName());

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        try {
            // Log the purchase details for debugging
            logger.info("Purchase details: {}", purchase);
            return checkoutService.placeOrder(purchase);
        } catch (Exception e) {
            logger.error("Error logging purchase details: {}", e.getMessage());
        }
        return null;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {

        try {
            // Log the payment info for debugging
            logger.info("pyment.amount: {} {}", paymentInfo.getAmount(), paymentInfo.getCurrency());
            //Create a payment intent using the provided payment info
            PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
            String paymentStr = paymentIntent.toJson();
//            logger.info("PAYMENT STRING{}", paymentStr);
            // Return the payment intent as a JSON string
            return new ResponseEntity<>(paymentStr, HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Error logging payment info: {}", e.getMessage());
            return new ResponseEntity<>("Error logging payment info", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
