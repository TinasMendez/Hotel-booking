package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.service.BookingMailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.nio.charset.StandardCharsets;

/**
 * Sends booking confirmation emails using Spring Mail.
 */
@Service
public class BookingMailServiceImpl implements BookingMailService {

    private static final Logger log = LoggerFactory.getLogger(BookingMailServiceImpl.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String supportEmail;
    private final TemplateEngine templateEngine;
    private final String frontBaseUrl;
    private final String supportPhone;
    private final String whatsappSupportUrl;

    public BookingMailServiceImpl(JavaMailSender mailSender,
                                  TemplateEngine templateEngine,
                                  @Value("${app.mail.from:noreply@digitalbooking.local}") String fromAddress,
                                  @Value("${app.mail.support-contact:reservas@digitalbooking.local}") String supportEmail,
                                  @Value("${app.frontend.base-url:http://localhost:5173}") String frontBaseUrl,
                                  @Value("${app.support.phone:}") String supportPhone,
                                  @Value("${app.whatsapp.support-url:}") String whatsappSupportUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.supportEmail = supportEmail;
        this.templateEngine = templateEngine;
        this.frontBaseUrl = frontBaseUrl;
        this.supportPhone = supportPhone;
        this.whatsappSupportUrl = whatsappSupportUrl;
    }

    @Override
    public void sendBookingConfirmation(User user, Product product, Booking booking) {
        if (user == null || product == null || booking == null) {
            log.warn("Skipping booking confirmation email due to missing data (user={}, product={}, booking={})",
                    user != null, product != null, booking != null);
            return;
        }
        String to = user.getEmail();
        if (to == null || to.isBlank()) {
            log.warn("Skipping booking confirmation email because user {} has no email", user.getId());
            return;
        }

        try {
            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject("Booking confirmation #" + booking.getId());

            Context context = new Context();
            context.setVariable("guestName", user.getFirstName() != null ? user.getFirstName() : user.getEmail());
            context.setVariable("guestEmail", user.getEmail());
            context.setVariable("bookingId", booking.getId());
            context.setVariable("productName", product.getName());
            String location = product.getCity() != null ? product.getCity().getName() : "";
            context.setVariable("productLocation", location);
            context.setVariable("propertyLocation", location);
            context.setVariable("checkIn", formatDate(booking.getStartDate()));
            context.setVariable("checkOut", formatDate(booking.getEndDate()));
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("sentAt", DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm").format(java.time.LocalDateTime.now()));
            context.setVariable("propertyUrl", buildPropertyUrl(product.getId()));
            context.setVariable("myBookingsUrl", buildMyBookingsUrl());
            context.setVariable("providerName", product.getCategory() != null ? product.getCategory().getName() : "Digital Booking");
            context.setVariable("providerEmail", supportEmail);
            context.setVariable("providerPhone", supportPhone != null && !supportPhone.isBlank() ? supportPhone : null);
            context.setVariable("whatsAppUrl", whatsappSupportUrl != null && !whatsappSupportUrl.isBlank() ? whatsappSupportUrl : null);
            context.setVariable("fromEmail", fromAddress);

            String htmlBody = templateEngine.process("email/booking-confirmation.html", context);
            helper.setText(buildPlainText(user, product, booking), htmlBody);

            mailSender.send(mimeMessage);
            log.info("Booking confirmation email sent to {} for booking {}", to, booking.getId());
        } catch (Exception ex) {
            log.error("Failed to send booking confirmation email to {}", to, ex);
        }
    }

    private String buildPlainText(User user, Product product, Booking booking) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hi ")
          .append(user.getFirstName() != null ? user.getFirstName() : user.getEmail())
          .append(",\n\n")
          .append("Your reservation is confirmed!\n\n")
          .append("Booking ID: ").append(booking.getId()).append("\n")
          .append("Property: ").append(product.getName()).append("\n")
          .append("Location: ").append(product.getCity() != null ? product.getCity().getName() : "-").append("\n")
          .append("Check-in: ").append(formatDate(booking.getStartDate())).append("\n")
          .append("Check-out: ").append(formatDate(booking.getEndDate())).append("\n\n")
          .append("We look forward to hosting you.\n")
          .append("If you need to make changes, visit your account in Digital Booking or contact ")
          .append(supportEmail)
          .append(".\n\n")
          .append("Best regards,\n")
          .append("Digital Booking Team");
        return sb.toString();
    }

    private String formatDate(java.time.LocalDate date) {
        return date != null ? DATE_FMT.format(date) : "";
    }

    private String buildPropertyUrl(Long productId) {
        if (productId == null || frontBaseUrl == null || frontBaseUrl.isBlank()) {
            return null;
        }
        String base = frontBaseUrl.replaceAll("/+$", "");
        return String.format("%s/product/%s", base, productId);
    }

    private String buildMyBookingsUrl() {
        if (frontBaseUrl == null || frontBaseUrl.isBlank()) {
            return null;
        }
        String base = frontBaseUrl.replaceAll("/+$", "");
        return String.format("%s/bookings", base);
    }
}
