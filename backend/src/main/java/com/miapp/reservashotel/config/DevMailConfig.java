package com.miapp.reservashotel.config;

import java.nio.charset.Charset;
import java.util.Optional;
import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Bean de correo para DEV apuntando a Mailpit (override vía spring.mail.*).
 * Permite probar envíos reales en local sin tocar perfiles productivos.
 */
@Configuration
@Profile("dev")
public class DevMailConfig {

    @Bean
    public JavaMailSender javaMailSender(MailProperties mailProperties) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(Optional.ofNullable(mailProperties.getHost()).orElse("localhost"));
        mailSender.setPort(Optional.ofNullable(mailProperties.getPort()).orElse(1025));
        mailSender.setUsername(mailProperties.getUsername());
        mailSender.setPassword(mailProperties.getPassword());
        if (mailProperties.getProtocol() != null) {
            mailSender.setProtocol(mailProperties.getProtocol());
        }

        Charset defaultEncoding = mailProperties.getDefaultEncoding();
        if (defaultEncoding != null) {
            mailSender.setDefaultEncoding(defaultEncoding.name());
        }

        if (!mailProperties.getProperties().isEmpty()) {
            Properties extraProperties = new Properties();
            extraProperties.putAll(mailProperties.getProperties());
            mailSender.setJavaMailProperties(extraProperties);
        }

        return mailSender;
    }
}
