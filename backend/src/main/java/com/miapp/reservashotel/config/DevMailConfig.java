// backend/src/main/java/com/miapp/reservashotel/config/DevMailConfig.java
package com.miapp.reservashotel.config;

import java.nio.charset.Charset;
import java.util.Properties;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Dev mail configuration.
 * WHY: Ensures MailProperties is registered and provides a JavaMailSender bean for the dev profile.
 * Reads all settings from spring.mail.* properties.
 */
@Configuration
@Profile("dev")
@EnableConfigurationProperties(MailProperties.class)
public class DevMailConfig {

    @Bean
    public JavaMailSender javaMailSender(MailProperties mailProperties) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        // Basic host/port/credentials from spring.mail.*
        sender.setHost(mailProperties.getHost());
        sender.setPort(mailProperties.getPort() != null ? mailProperties.getPort() : 0);
        sender.setUsername(mailProperties.getUsername());
        sender.setPassword(mailProperties.getPassword());

        Charset enc = mailProperties.getDefaultEncoding();
        if (enc != null) {
            sender.setDefaultEncoding(enc.name());
        }

        // Additional JavaMail properties (e.g., smtp.auth, starttls.enable, etc.)
        if (!mailProperties.getProperties().isEmpty()) {
            Properties extra = new Properties();
            extra.putAll(mailProperties.getProperties());
            sender.setJavaMailProperties(extra);
        }

        return sender;
    }
}
