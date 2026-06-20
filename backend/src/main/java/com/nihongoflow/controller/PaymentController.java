package com.nihongoflow.controller;

import com.nihongoflow.dto.ApiResponse;
import com.nihongoflow.dto.PaymentDto;
import com.nihongoflow.security.UserPrincipal;
import com.nihongoflow.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final String frontendUrl;
    private final PaymentService paymentService;

    public PaymentController(
            @Value("${app.frontend-url}") String frontendUrl,
            PaymentService paymentService) {
        this.frontendUrl = frontendUrl;
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentDto> createPayment(
            @RequestParam Long courseId,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        String ipAddr = getClientIp(request);
        return ApiResponse.ok(paymentService.createPayment(courseId, principal.getId(), ipAddr));
    }

    @GetMapping("/vnpay-return")
    public void handleReturn(
            @RequestParam Map<String, String> allParams,
            HttpServletResponse response) throws IOException {
        Map<String, String> params = new HashMap<>(allParams);
        PaymentService.ReturnResult result;
        try {
            result = paymentService.handleVnpayReturn(params);
        } catch (Exception e) {
            response.sendRedirect(frontendUrl + "/thanh-toan/ket-qua?success=false");
            return;
        }
        response.sendRedirect(
                frontendUrl + "/thanh-toan/ket-qua?success=" + result.success() + "&courseId=" + result.courseId());
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
