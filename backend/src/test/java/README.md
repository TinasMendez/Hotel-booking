# Test Folder

This folder contains **unit** and **integration** tests for the backend.

## Test Environment
- **In-memory H2** database to isolate tests from MySQL.
- **Profile `test`** with a dedicated configuration file:
  - `src/test/resources/application-test.properties`
    ```properties
    # H2 test datasource
    spring.datasource.url=jdbc:h2:mem:reservas_testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=false
    spring.datasource.username=sa
    spring.datasource.password=
    spring.datasource.driver-class-name=org.h2.Driver

    # JPA/Hibernate for tests
    spring.jpa.hibernate.ddl-auto=create-drop
    spring.jpa.show-sql=false
    

    # Disable seed & security auto-config in tests
    spring.sql.init.mode=never
    spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration,org.springframework.boot.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration

    server.port=0
    ```
- Integration tests should include:
  ```java
  @ActiveProfiles("test")
