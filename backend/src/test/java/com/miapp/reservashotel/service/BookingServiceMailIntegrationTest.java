package com.miapp.reservashotel.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetupTest;
import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/**
 * Integration test that verifies a booking triggers a real SMTP delivery.
 */
@SpringBootTest
@ActiveProfiles("test")
class BookingServiceMailIntegrationTest {

    private static final GreenMail GREEN_MAIL = new GreenMail(ServerSetupTest.SMTP.dynamicPort());

    static {
        GREEN_MAIL.start();
    }

    @DynamicPropertySource
    static void mailProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.mail.host", () -> "localhost");
        registry.add("spring.mail.port", () -> GREEN_MAIL.getSmtp().getServerSetup().getPort());
        registry.add("spring.mail.properties.mail.smtp.auth", () -> false);
        registry.add("spring.mail.properties.mail.smtp.starttls.enable", () -> false);
    }

    @AfterAll
    static void stopGreenMail() {
        GREEN_MAIL.stop();
    }

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @BeforeEach
    void cleanState() {
        GREEN_MAIL.purgeEmailFromAllMailboxes();
        bookingRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void whenBookingIsCreated_emailIsDeliveredToConfiguredInbox() throws Exception {
        User user = new User();
        user.setFirstName("Alice");
        user.setLastName("Tester");
        user.setEmail("alice@example.com");
        user.setPassword("secret");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Loft " + UUID.randomUUID());
        product.setDescription("Test property for SMTP integration");
        product = productRepository.save(product);

        BookingRequestDTO request = new BookingRequestDTO();
        request.setProductId(product.getId());
        request.setCustomerId(user.getId());
        request.setStartDate(LocalDate.now().plusDays(3));
        request.setEndDate(LocalDate.now().plusDays(5));

        BookingResponseDTO response = bookingService.createBooking(request);

        boolean received = GREEN_MAIL.waitForIncomingEmail(5_000L, 1);
        assertThat(received).as("Booking confirmation email should arrive in test inbox").isTrue();

        MimeMessage[] messages = GREEN_MAIL.getReceivedMessages();
        assertThat(messages).hasSize(1);

        MimeMessage message = messages[0];
        assertThat(message.getAllRecipients()[0].toString()).isEqualTo("alice@example.com");
        assertThat(message.getFrom()[0].toString()).isEqualTo("noreply@digitalbooking.local");
        assertThat(message.getSubject()).contains("#" + response.getId());

        String body = GreenMailUtil.getBody(message);
        assertThat(body)
                .contains("Your reservation is confirmed")
                .contains(product.getName())
                .contains(response.getId().toString());
    }
}

