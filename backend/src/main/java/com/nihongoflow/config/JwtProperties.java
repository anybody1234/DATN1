package com.nihongoflow.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long accessExpiration;
    private long refreshExpiration;

    public String getSecret() {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException(
                    "JWT_SECRET is not configured. Set the jwt.secret property or JWT_SECRET environment variable.");
        }
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getAccessExpiration() {
        return accessExpiration;
    }

    public void setAccessExpiration(long accessExpiration) {
        this.accessExpiration = accessExpiration;
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }

    public void setRefreshExpiration(long refreshExpiration) {
        this.refreshExpiration = refreshExpiration;
    }
}
