package com.miapp.reservashotel.config;

import java.io.InputStream;
import jakarta.mail.Session;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

/**
 * Bean de correo para DEV que no envía nada.
 * Por qué: permite que la app arranque sin configurar SMTP.
 */
@Configuration
@Profile("dev")
public class DevMailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        return new NoOpJavaMailSender();
    }

    static class NoOpJavaMailSender implements JavaMailSender {
        @Override public MimeMessage createMimeMessage() { return new MimeMessage((Session) null); }
        @Override public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
            try { return new MimeMessage(null, contentStream); }
            catch (MessagingException e) { throw new MailParseException(e); }
        }
        @Override public void send(SimpleMailMessage simpleMessage) throws MailException { /* no-op */ }
        @Override public void send(SimpleMailMessage... simpleMessages) throws MailException { /* no-op */ }
        @Override public void send(MimeMessage mimeMessage) throws MailException { /* no-op */ }
        @Override public void send(MimeMessage... mimeMessages) throws MailException { /* no-op */ }
        @Override public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException { /* no-op */ }
        @Override public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException { /* no-op */ }
    }
}
