package com.smartcampus.attendance;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CheckInRequest {

    @NotBlank(message = "QR Token is required")
    private String qrToken;

    private BigDecimal latitude;
    private BigDecimal longitude;

    public CheckInRequest() {}
    public CheckInRequest(String qrToken) { this.qrToken = qrToken; }

    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
}
