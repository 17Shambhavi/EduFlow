package com.lms.repository;

import com.lms.model.Payment;
import com.lms.model.User;
import com.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudent(User student);
    List<Payment> findByCourse(Course course);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE " +
            "p.course.instructor = :instructor AND " +
            "p.status = 'SUCCESS'")
    Double findTotalRevenueByInstructor(User instructor);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double findTotalPlatformRevenue();
}