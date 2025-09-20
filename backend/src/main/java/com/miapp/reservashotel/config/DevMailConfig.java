package com.miapp.reservashotel.config;

import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Properties;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.util.StringUtils;

/**
 * Dev profile mail configuration that wires a real {@link JavaMailSender} using the
 * standard {@code spring.mail.*} properties when a host is provided.
 *
 * <p>Defaults are provided via {@code application-dev.properties} so that developers can
 * simply run Mailpit/Mailhog locally (host {@code localhost}, port {@code 1025}). If the
 * host is left empty we fall back to a {@link NoOpJavaMailSender} so the app can still
 * boot without SMTP.</p>
 */
@Configuration
@Profile("dev")
@EnableConfigurationProperties(MailProperties.class)
public class DevMailConfig {

    private static final Logger log = LoggerFactory.getLogger(DevMailConfig.class);

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    JavaMailSender devMailSender(MailProperties properties) {
        if (!StringUtils.hasText(properties.getHost())) {
            log.warn("[dev] No spring.mail.host configured; falling back to NoOpJavaMailSender");
            return new NoOpJavaMailSender();
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(properties.getHost());
        if (properties.getPort() != null) {
            sender.setPort(properties.getPort());
        }
        sender.setUsername(properties.getUsername());
        sender.setPassword(properties.getPassword());
        Charset defaultEncoding = properties.getDefaultEncoding();
        if (defaultEncoding != null) {
            sender.setDefaultEncoding(defaultEncoding.name());
        }
        if (properties.getProtocol() != null) {
            sender.setProtocol(properties.getProtocol());
        }
        if (!properties.getProperties().isEmpty()) {
            Properties javaMailProps = new Properties();
            javaMailProps.putAll(properties.getProperties());
            sender.setJavaMailProperties(javaMailProps);
        }

        log.info("[dev] JavaMailSender configured for host={} port={}", sender.getHost(), sender.getPort());
        return sender;
    }

    private static class NoOpJavaMailSender implements JavaMailSender {
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
