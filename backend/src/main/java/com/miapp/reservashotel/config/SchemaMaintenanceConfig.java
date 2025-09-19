package com.miapp.reservashotel.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Ensures product rating columns exist before the application starts serving requests.
 */
@Configuration
public class SchemaMaintenanceConfig {

    private static final Logger log = LoggerFactory.getLogger(SchemaMaintenanceConfig.class);

    @Bean
    public CommandLineRunner ensureProductRatingColumns(JdbcTemplate jdbcTemplate,
                                                        DataSource dataSource,
                                                        @Value("${app.db.ensure-product-rating-columns:true}") boolean enabled) {
        return args -> {
            if (!enabled) {
                log.debug("Skipping product rating column verification (disabled)");
                return;
            }
            ensureColumn(jdbcTemplate, dataSource, "products", "rating_average", "DOUBLE NOT NULL DEFAULT 0");
            ensureColumn(jdbcTemplate, dataSource, "products", "rating_count", "BIGINT NOT NULL DEFAULT 0");
        };
    }

    private void ensureColumn(JdbcTemplate jdbcTemplate, DataSource dataSource,
                              String tableName, String columnName, String columnDefinition) {
        try {
            if (!columnExists(dataSource, tableName, columnName)) {
                log.info("Adding missing column '{}' to table '{}'", columnName, tableName);
                jdbcTemplate.execute("ALTER TABLE " + tableName + " ADD COLUMN " + columnName + " " + columnDefinition);
            } else {
                jdbcTemplate.update("UPDATE " + tableName + " SET " + columnName + " = 0 WHERE " + columnName + " IS NULL");
            }
        } catch (SQLException | DataAccessException ex) {
            throw new IllegalStateException("Failed to ensure column " + columnName + " on table " + tableName, ex);
        }
    }

    private boolean columnExists(DataSource dataSource, String tableName, String columnName) throws SQLException {
        Connection connection = DataSourceUtils.getConnection(dataSource);
        try {
            DatabaseMetaData metaData = connection.getMetaData();
            if (hasColumn(metaData, connection, tableName, columnName)) {
                return true;
            }
            String upperTable = tableName.toUpperCase();
            String upperColumn = columnName.toUpperCase();
            return hasColumn(metaData, connection, upperTable, upperColumn)
                    || hasColumn(metaData, connection, upperTable, columnName)
                    || hasColumn(metaData, connection, tableName, upperColumn);
        } finally {
            DataSourceUtils.releaseConnection(connection, dataSource);
        }
    }

    private boolean hasColumn(DatabaseMetaData metaData, Connection connection,
                               String tableName, String columnName) throws SQLException {
        try (ResultSet rs = metaData.getColumns(connection.getCatalog(), connection.getSchema(), tableName, columnName)) {
            return rs.next();
        }
    }
}
