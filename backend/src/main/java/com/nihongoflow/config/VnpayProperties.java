package com.nihongoflow.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vnpay")
public class VnpayProperties {

    private String tmnCode;
    private String hashSecret;
    private String url;
    private String returnUrl;

    public String getTmnCode() { return tmnCode; }
    public void setTmnCode(String tmnCode) { this.tmnCode = tmnCode; }

    public String getHashSecret() { return hashSecret; }
    public void setHashSecret(String hashSecret) { this.hashSecret = hashSecret; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getReturnUrl() { return returnUrl; }
    public void setReturnUrl(String returnUrl) { this.returnUrl = returnUrl; }
}
