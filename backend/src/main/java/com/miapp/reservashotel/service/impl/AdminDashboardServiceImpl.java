package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.admin.AdminBookingBucketsDTO;
import com.miapp.reservashotel.dto.admin.AdminBookingDetailDTO;
import com.miapp.reservashotel.dto.admin.AdminDashboardSummaryDTO;
import com.miapp.reservashotel.dto.admin.CategoryWithCountDTO;
import com.miapp.reservashotel.dto.admin.ProductListItemDTO;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;
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

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation using repositories where convenient and JPQL for small projections.
 * Keeps changes additive and non-breaking with your existing API.
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
        List<com.miapp.reservashotel.model.Product> last = productRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();
        dto.setLastProducts(last.stream()
                .map(p -> new AdminDashboardSummaryDTO.ProductMiniDTO(p.getId(), p.getName()))
                .collect(Collectors.toList()));

        // Last 5 bookings (id/productId/customerId)
        List<Booking> lastBookings = bookingRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();
        List<AdminDashboardSummaryDTO.BookingMiniDTO> minis = new ArrayList<>();
        for (Booking b : lastBookings) {
            minis.add(new AdminDashboardSummaryDTO.BookingMiniDTO(
                    getId(b),
                    readLong(b, "getProductId"),
                    readLong(b, "getCustomerId")
            ));
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

    @Override
    public List<AdminBookingDetailDTO> getLatestBookingsDetailed(int limit) {
        int lim = limit <= 0 ? 5 : Math.min(limit, 50);
        List<Booking> bookings = bookingRepository.findAll(
                        PageRequest.of(0, lim, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();

        List<AdminBookingDetailDTO> out = new ArrayList<>();
        for (Booking b : bookings) {
            out.add(toDetail(b));
        }
        return out;
    }

    @Override
    public AdminBookingBucketsDTO getBookingBuckets(Integer limitPerBucket, Integer scanWindow) {
        int limit = (limitPerBucket == null || limitPerBucket <= 0) ? 8 : Math.min(limitPerBucket, 50);
        int scan = (scanWindow == null || scanWindow <= 0) ? 200 : Math.min(scanWindow, 1000);

        List<Booking> bookings = bookingRepository.findAll(
                        PageRequest.of(0, scan, Sort.by(Sort.Direction.DESC, "id")))
                .getContent();

        LocalDate today = LocalDate.now();

        List<AdminBookingDetailDTO> active = new ArrayList<>();
        List<AdminBookingDetailDTO> previous = new ArrayList<>();
        List<AdminBookingDetailDTO> cancelled = new ArrayList<>();

        for (Booking b : bookings) {
            // Cancelled?
            if (isCancelled(b)) {
                if (cancelled.size() < limit) cancelled.add(toDetail(b));
                continue;
            }

            LocalDate in = parseDate(call(b, "getCheckIn"),
                    call(b, "getCheckInDate"),
                    call(b, "getStartDate"),
                    call(b, "getStart"));
            LocalDate out = parseDate(call(b, "getCheckOut"),
                    call(b, "getCheckOutDate"),
                    call(b, "getEndDate"),
                    call(b, "getEnd"));

            Integer nights = readInt(b, "getNights", "getTotalNights");
            if (out == null && in != null && nights != null && nights >= 0) {
                out = in.plusDays(nights);
            }

            // Bucketing:
            // - Active: not cancelled AND check-in strictly in the future (hasn't started yet).
            // - Previous: not cancelled AND check-out strictly in the past.
            // - Else (unknown/missing dates): send to Previous to avoid showing as Active.
            if (in != null && in.isAfter(today)) {
                if (active.size() < limit) active.add(toDetail(b));
            } else if (out != null && out.isBefore(today)) {
                if (previous.size() < limit) previous.add(toDetail(b));
            } else {
                // Current or unknown dates -> treat as "previous" bucket to keep Active clean.
                if (previous.size() < limit) previous.add(toDetail(b));
            }

            // Early break when all buckets are filled
            if (active.size() >= limit && previous.size() >= limit && cancelled.size() >= limit) {
                break;
            }
        }

        return new AdminBookingBucketsDTO(active, previous, cancelled);
    }

    // ---- helpers -----------------------------------------------------------

    private long countAdmins() {
        Long num = em.createQuery(
                        "select count(distinct u.id) from User u join u.roles r where r.name in ('ROLE_ADMIN','ADMIN')",
                        Long.class)
                .getSingleResult();
        return num == null ? 0L : num.longValue();
    }

    private Long getId(Object entity) {
        Object val = call(entity, "getId");
        return (val instanceof Number) ? ((Number) val).longValue() : null;
    }

    private Long readLong(Object obj, String getter) {
        Object v = call(obj, getter);
        return (v instanceof Number) ? ((Number) v).longValue() : null;
    }

    private Integer readInt(Object obj, String... getters) {
        for (String g : getters) {
            Object v = call(obj, g);
            if (v instanceof Number) return ((Number) v).intValue();
        }
        return null;
    }

    private Object call(Object obj, String getter) {
        if (obj == null || getter == null) return null;
        try {
            Method m = obj.getClass().getMethod(getter);
            return m.invoke(obj);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String safeString(Object v) {
        if (v == null) return null;
        if (v instanceof TemporalAccessor) return v.toString();
        return String.valueOf(v);
    }

    private String firstNonNullStr(Object... arr) {
        Object v = firstNonNull(arr);
        return v == null ? null : safeString(v);
    }

    private Object firstNonNull(Object... arr) {
        if (arr == null) return null;
        for (Object a : arr) if (a != null) return a;
        return null;
    }

    /**
     * Formats a numeric amount to a 2-decimal string using modern RoundingMode.
     * Returns null when the input is null.
     */
    private String formatAmount(Object v) {
        if (v == null) return null;

        if (v instanceof BigDecimal) {
            return ((BigDecimal) v)
                    .setScale(2, RoundingMode.HALF_UP)
                    .toPlainString();
        }
        if (v instanceof Number) {
            BigDecimal bd = new BigDecimal(((Number) v).toString())
                    .setScale(2, RoundingMode.HALF_UP);
            return bd.toPlainString();
        }
        return v.toString();
    }

    private AdminBookingDetailDTO toDetail(Booking b) {
        AdminBookingDetailDTO row = new AdminBookingDetailDTO();
        row.setId(getId(b));
        Long pid = readLong(b, "getProductId");
        Long uid = readLong(b, "getCustomerId");
        row.setProductId(pid);
        row.setCustomerId(uid);

        // Product
        if (pid != null) {
            Optional<Product> p = productRepository.findById(pid);
            row.setProductName(p.map(Product::getName).orElse("(unknown)"));
        } else {
            row.setProductName("(unknown)");
        }

        // User
        if (uid != null) {
            Optional<User> uo = userRepository.findById(uid);
            if (uo.isPresent()) {
                User u = uo.get();
                row.setCustomerEmail(safeString(call(u, "getEmail")));
                String fn = safeString(call(u, "getFirstName"));
                String ln = safeString(call(u, "getLastName"));
                String nm = (fn + " " + ln).trim();
                row.setCustomerName(nm.isEmpty() ? null : nm);
            }
        }

        // Dates
        LocalDate in = parseDate(call(b, "getCheckIn"),
                call(b, "getCheckInDate"),
                call(b, "getStartDate"),
                call(b, "getStart"));
        LocalDate out = parseDate(call(b, "getCheckOut"),
                call(b, "getCheckOutDate"),
                call(b, "getEndDate"),
                call(b, "getEnd"));
        Integer nights = readInt(b, "getNights", "getTotalNights");
        if (out == null && in != null && nights != null && nights >= 0) {
            out = in.plusDays(nights);
        }

        row.setCheckIn(in == null ? null : in.toString());
        row.setCheckOut(out == null ? null : out.toString());
        if (nights == null && in != null && out != null) {
            nights = (int) ChronoUnit.DAYS.between(in, out);
        }
        row.setNights(nights);

        // Total
        Object totalObj = firstNonNull(
                call(b, "getTotalPrice"),
                call(b, "getTotalAmount"),
                call(b, "getAmount"),
                call(b, "getTotal")
        );
        row.setTotal(formatAmount(totalObj));

        return row;
    }

    private boolean isCancelled(Booking b) {
        // Boolean getters first
        Object v = firstNonNull(
                call(b, "isCancelled"),
                call(b, "getCancelled"),
                call(b, "isCanceled"),
                call(b, "getCanceled")
        );
        if (v instanceof Boolean) return (Boolean) v;

        // Status string second
        String status = firstNonNullStr(
                call(b, "getStatus"),
                call(b, "getBookingStatus"),
                call(b, "getState")
        );
        if (status != null) {
            String s = status.trim().toUpperCase();
            if (s.contains("CANCEL")) return true;       // CANCELLED / CANCELED
            if (s.contains("ANUL")) return true;         // ANULADA/ANULADO
            if (s.contains("VOID")) return true;
        }
        return false;
    }

    private LocalDate parseDate(Object ...candidates) {
        for (Object c : candidates) {
            if (c == null) continue;
            if (c instanceof LocalDate) return (LocalDate) c;
            if (c instanceof java.util.Date) {
                return ((java.util.Date) c).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            }
            if (c instanceof LocalDateTime) {
                return ((LocalDateTime) c).toLocalDate();
            }
            if (c instanceof CharSequence) {
                String s = c.toString().trim();
                if (s.isEmpty()) continue;
                // Try ISO-8601 first (yyyy-MM-dd)
                try { return LocalDate.parse(s); } catch (DateTimeParseException ignored) {}
                // Try LocalDateTime and then take toLocalDate
                try { return LocalDateTime.parse(s).toLocalDate(); } catch (DateTimeParseException ignored) {}
            }
        }
        return null;
    }
}

