-- ===== ROLES (optional) =====
INSERT IGNORE INTO roles (name) VALUES ('ADMIN');
INSERT IGNORE INTO roles (name) VALUES ('USER');

-- ===== USERS (optional) =====
-- BCrypt for "admin123"
INSERT IGNORE INTO users (username, email, password)
VALUES ('admin', 'admin@demo.com', '$2b$10$AsMybzWVd2ZM0Ol7a/HEJuiGhJwJznMQsAZmmaPJs.Wdzqg0mqIOm');

-- ===== CATEGORIES =====
INSERT IGNORE INTO categories (name, description, image_url) VALUES
('Beachfront', 'Properties close to the beach', 'https://picsum.photos/seed/cat1/800/400'),
('City Center', 'Downtown locations', 'https://picsum.photos/seed/cat2/800/400');

-- ===== CITIES =====
INSERT IGNORE INTO cities (name, description, image_url) VALUES
('Bogotá', 'Capital city', 'https://picsum.photos/seed/city1/800/400'),
('Medellín', 'City of eternal spring', 'https://picsum.photos/seed/city2/800/400');

-- ===== FEATURES =====
INSERT IGNORE INTO features (name, description, icon) VALUES
('WiFi', 'High-speed internet', 'wifi'),
('Pool', 'Swimming pool', 'pool'),
('Parking', 'Private parking', 'parking');
