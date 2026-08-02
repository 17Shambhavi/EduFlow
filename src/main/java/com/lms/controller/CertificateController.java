package com.lms.controller;

import com.lms.model.Certificate;
import com.lms.model.User;
import com.lms.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("/generate/{enrollmentId}")
    public ResponseEntity<byte[]> generateCertificate(
            @PathVariable Long enrollmentId,
            @AuthenticationPrincipal User user) {
        byte[] pdf = certificateService.generateCertificate(user, enrollmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<Certificate> verifyCertificate(
            @PathVariable String code) {
        return ResponseEntity.ok(
                certificateService.verifyCertificate(code));
    }
}