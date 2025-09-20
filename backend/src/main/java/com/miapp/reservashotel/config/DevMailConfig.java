package com.miapp.reservashotel.config;

import java.nio.charset.Charset;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.StringUtils;

/**
 * Dev profile mail configuration that wires a real {@link JavaMailSender} using the
 * standard {@code spring.mail.*} properties when a host is provided.
 *
 * <p>Defaults are provided via {@code application-dev.properties} so that developers can
 * simply run Mailpit/Mailhog locally (host {@code localhost}, port {@code 1025}). When no
 * host is configured we still point to {@code localhost:1025}, allowing developers to
 * receive messages through a local Mailpit instance without any extra setup.</p>
 */
@Configuration
@Profile("dev")
@EnableConfigurationProperties(MailProperties.class)
public class DevMailConfig {

    private static final Logger log = LoggerFactory.getLogger(DevMailConfig.class);

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    JavaMailSender devMailSender(MailProperties properties) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        String host = StringUtils.hasText(properties.getHost()) ? properties.getHost() : "localhost";
        sender.setHost(host);
        sender.setPort(properties.getPort() != null ? properties.getPort() : 1025);
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
}
