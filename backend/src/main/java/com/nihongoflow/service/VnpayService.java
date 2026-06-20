package com.nihongoflow.service;

import com.nihongoflow.config.VnpayProperties;
import jakarta.annotation.PostConstruct;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class VnpayService {

    private final VnpayProperties props;

    public VnpayService(VnpayProperties props) {
        this.props = props;
    }

    @PostConstruct
    private void validate() {
        if (props.getTmnCode() == null || props.getHashSecret() == null) {
            throw new IllegalStateException("VNPay tmnCode và hashSecret không được để trống");
        }
    }

    public String buildPaymentUrl(String txnRef, long amount, String orderInfo, String ipAddr) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
        fmt.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        TreeMap<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", props.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", props.getReturnUrl());
        params.put("vnp_IpAddr", ipAddr);
        params.put("vnp_CreateDate", fmt.format(cal.getTime()));

        cal.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", fmt.format(cal.getTime()));

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value != null && !value.isEmpty()) {
                if (!first) {
                    hashData.append('&');
                    query.append('&');
                }
                hashData.append(key).append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(key, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                first = false;
            }
        }

        String secureHash = hmacSHA512(props.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        return props.getUrl() + "?" + query;
    }

    public boolean verifyReturn(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) return false;

        TreeMap<String, String> sorted = new TreeMap<>(params);
        sorted.remove("vnp_SecureHash");
        sorted.remove("vnp_SecureHashType");

        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : sorted.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (!first) hashData.append('&');
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
                first = false;
            }
        }

        String computed = hmacSHA512(props.getHashSecret(), hashData.toString());
        return computed.equalsIgnoreCase(receivedHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tính HMAC-SHA512", e);
        }
    }
}
