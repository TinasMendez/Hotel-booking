package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.admin.AdminDashboardSummaryDTO;
import com.miapp.reservashotel.dto.admin.CategoryWithCountDTO;
import com.miapp.reservashotel.dto.admin.ProductListItemDTO;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.AdminDashboardService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation using repositories where convenient and JPQL for small projections.
 */
@Service
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @PersistenceContext
    private EntityManager em;

    public AdminDashboardServiceImpl(ProductRepository productRepository,
                                     CategoryRepository categoryRepository,
                                     FeatureRepository featureRepository,
                                     UserRepository userRepository,
                                     BookingRepository bookingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public AdminDashboardSummaryDTO getDashboardSummary() {
        AdminDashboardSummaryDTO dto = new AdminDashboardSummaryDTO();

        dto.setProductsCount(productRepository.count());
        dto.setCategoriesCount(categoryRepository.count());
        dto.setFeaturesCount(featureRepository.count());
        dto.setUsersCount(userRepository.count());
        dto.setAdminsCount(countAdmins());

        // Last 5 products
        List<Product> last = productRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();
        dto.setLastProducts(last.stream()
                .map(p -> new AdminDashboardSummaryDTO.ProductMiniDTO(p.getId(), p.getName()))
                .collect(Collectors.toList()));

        // Last 5 bookings (Booking has productId and customerId as simple fields)
        List<Booking> lastBookings = bookingRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();
        List<AdminDashboardSummaryDTO.BookingMiniDTO> minis = new ArrayList<>();
        for (Booking b : lastBookings) {
            minis.add(new AdminDashboardSummaryDTO.BookingMiniDTO(b.getId(), b.getProductId(), b.getCustomerId()));
        }
        dto.setLastBookings(minis);

        return dto;
    }

    @Override
    public List<CategoryWithCountDTO> listCategoriesWithProductCount() {
        List<Object[]> rows = em.createQuery(
                "select c.id, c.name, (select count(p.id) from Product p where p.category.id = c.id) " +
                        "from Category c order by c.id asc", Object[].class)
                .getResultList();

        List<CategoryWithCountDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            Long id = (Long) r[0];
            String name = (String) r[1];
            Long count = (Long) r[2];
            out.add(new CategoryWithCountDTO(id, name, count == null ? 0L : count.longValue()));
        }
        return out;
    }

    @Override
    public List<ProductListItemDTO> listProductsByCategory(Long categoryId) {
        return em.createQuery(
                        "select new com.miapp.reservashotel.dto.admin.ProductListItemDTO(p.id, p.name) " +
                                "from Product p where p.category.id = :cid order by p.id desc",
                        ProductListItemDTO.class)
                .setParameter("cid", categoryId)
                .getResultList();
    }

    // --- helpers ---
    private long countAdmins() {
        Long num = em.createQuery(
                        "select count(distinct u.id) from User u join u.roles r where r.name in ('ROLE_ADMIN','ADMIN')",
                        Long.class)
                .getSingleResult();
        return num == null ? 0L : num.longValue();
    }
}
