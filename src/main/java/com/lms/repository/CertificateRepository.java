package com.lms.repository;

import com.lms.model.Certificate;
import com.lms.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByEnrollment(Enrollment enrollment);
    Optional<Certificate> findByCertificateCode(String certificateCode);
    boolean existsByEnrollment(Enrollment enrollment);
}