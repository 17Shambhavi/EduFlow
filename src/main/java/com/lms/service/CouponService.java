package com.lms.service;

import com.lms.model.Coupon;
import com.lms.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public double applyCoupon(String code, double originalPrice) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code!"));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is inactive!");
        }

        if (coupon.getExpiry() != null &&
                coupon.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired!");
        }

        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit reached!");
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        double discount = originalPrice * coupon.getDiscountPercent() / 100;
        return originalPrice - discount;
    }
}