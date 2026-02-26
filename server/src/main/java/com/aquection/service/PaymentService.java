package com.aquection.service;

import com.aquection.dto.PaymentOrderResponse;
import com.aquection.entity.Payment;
import com.aquection.entity.User;
import com.aquection.repository.PaymentRepository;
import com.aquection.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository,
            EmailService emailService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public String getKeyId() {
        return keyId;
    }

    public PaymentOrderResponse createOrder(double amount, User user) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);

        Payment payment = new Payment();
        payment.setOrderId(order.get("id"));
        payment.setAmount(Long.valueOf(order.get("amount").toString()));
        payment.setCurrency(order.get("currency"));
        payment.setStatus(order.get("status"));
        payment.setUser(user);
        payment.setDescription("Premium Membership upgrade");
        payment.setCustomerEmail(user.getEmail());
        payment.setCustomerName(user.getFullName());

        paymentRepository.save(payment);

        return PaymentOrderResponse.builder()
                .orderId(order.get("id"))
                .keyId(keyId)
                .amount(Long.valueOf(order.get("amount").toString()))
                .currency(order.get("currency"))
                .status(order.get("status"))
                .build();
    }

    @Transactional
    public boolean verifyAndConfirmPayment(Map<String, String> details, User user) {
        try {
            String razorpayOrderId = details.get("razorpay_order_id");
            String razorpayPaymentId = details.get("razorpay_payment_id");
            String razorpaySignature = details.get("razorpay_signature");

            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

            if (isValid) {
                Optional<Payment> paymentOpt = paymentRepository.findByOrderId(razorpayOrderId);
                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                    payment.setPaymentId(razorpayPaymentId);
                    payment.setStatus("paid");
                    paymentRepository.save(payment);

                    // Upgrade User
                    user.setAccountType(User.AccountType.PREMIUM);
                    user.setPlanExpiryDate(java.time.LocalDateTime.now().plusMonths(1));
                    userRepository.save(user);

                    // Send Success Email
                    try {
                        emailService.sendPaymentSuccessEmail(user.getEmail(), user.getFullName(), razorpayOrderId,
                                razorpayPaymentId, payment.getAmount() / 100);
                    } catch (Exception e) {
                        System.err.println("Failed to send payment success email: " + e.getMessage());
                    }

                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
