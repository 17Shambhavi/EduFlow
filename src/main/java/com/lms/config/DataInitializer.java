package com.lms.config;

import com.lms.model.Coupon;
import com.lms.model.User;
import com.lms.repository.CouponRepository;
import com.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // KHUSHUU20 coupon seed
        if (!couponRepository.existsByCode("KHUSHUU20")) {
            Coupon coupon = Coupon.builder()
                    .code("KHUSHUU20")
                    .discountPercent(20.0)
                    .usageLimit(1000)
                    .usedCount(0)
                    .active(true)
                    .expiry(LocalDateTime.now().plusYears(1))
                    .build();
            couponRepository.save(coupon);
            System.out.println("✅ KHUSHUU20 coupon created!");
        }
        // Default Admin seed
        if (!userRepository.existsByEmail("admin@lms.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@lms.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .verified(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Default admin created!");
        }
    }
}