package com.nihongoflow.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cookie")
public class AppCookieProperties {
    /** Secure flag cho refresh cookie — bật true khi deploy HTTPS (bắt buộc nếu sameSite=None). */
    private boolean secure = false;

    /** SameSite cho refresh cookie — "Strict" khi frontend/backend cùng site, "None" khi khác domain (cần secure=true). */
    private String sameSite = "Strict";

    public boolean isSecure() {
        return secure;
    }

    public void setSecure(boolean secure) {
        this.secure = secure;
    }

    public String getSameSite() {
        return sameSite;
    }

    public void setSameSite(String sameSite) {
        this.sameSite = sameSite;
    }
}
