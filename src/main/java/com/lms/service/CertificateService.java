package com.lms.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.lms.model.*;
import com.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;

    public byte[] generateCertificate(User student, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found!"));

        if (enrollment.getProgressPercent() < 100.0) {
            throw new RuntimeException(
                    "Complete the course 100% to get certificate!");
        }

        Certificate certificate = certificateRepository
                .findByEnrollment(enrollment)
                .orElseGet(() -> {
                    Certificate cert = Certificate.builder()
                            .enrollment(enrollment)
                            .certificateCode(UUID.randomUUID().toString())
                            .build();
                    return certificateRepository.save(cert);
                });

        return generatePdf(student, enrollment, certificate);
    }

    private byte[] generatePdf(User student, Enrollment enrollment,
                               Certificate certificate) {
        try {
            Document document = new Document(PageSize.A4.rotate());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 36,
                    Font.BOLD, BaseColor.DARK_GRAY);
            Font nameFont = new Font(Font.FontFamily.HELVETICA, 28,
                    Font.BOLD, new BaseColor(44, 62, 80));
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 16,
                    Font.NORMAL, BaseColor.DARK_GRAY);
            Font smallFont = new Font(Font.FontFamily.HELVETICA, 10,
                    Font.ITALIC, BaseColor.GRAY);

            document.add(new Paragraph("\n\n"));

            Paragraph title = new Paragraph(
                    "CERTIFICATE OF COMPLETION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n"));

            Paragraph subtitle = new Paragraph(
                    "This is to certify that", normalFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph("\n"));

            Paragraph name = new Paragraph(student.getName(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);

            document.add(new Paragraph("\n"));

            Paragraph courseText = new Paragraph(
                    "has successfully completed the course", normalFont);
            courseText.setAlignment(Element.ALIGN_CENTER);
            document.add(courseText);

            Paragraph courseName = new Paragraph(
                    enrollment.getCourse().getTitle(), nameFont);
            courseName.setAlignment(Element.ALIGN_CENTER);
            document.add(courseName);

            document.add(new Paragraph("\n\n"));

            Paragraph code = new Paragraph(
                    "Certificate ID: " + certificate.getCertificateCode(), smallFont);
            code.setAlignment(Element.ALIGN_CENTER);
            document.add(code);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating certificate PDF!");
        }
    }

    public Certificate verifyCertificate(String code) {
        return certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new RuntimeException("Certificate not found!"));
    }
}