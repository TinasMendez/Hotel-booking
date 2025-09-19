// backend/src/main/java/com/miapp/reservashotel/repository/RatingRepository.java
package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.dto.RatingSummaryDTO;
import com.miapp.reservashotel.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Rating JPA repository using simple foreign keys.
 */
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndProductId(Long userId, Long productId);

    List<Rating> findByProductIdOrderByCreatedAtDesc(Long productId);

    @Query("select avg(r.score) from Rating r where r.productId = :productId")
    Double averageScoreByProductId(@Param("productId") Long productId);

    @Query("select new com.miapp.reservashotel.dto.RatingSummaryDTO(coalesce(avg(r.score), 0), count(r)) " +
           "from Rating r where r.productId = :productId")
    RatingSummaryDTO summarizeByProductId(@Param("productId") Long productId);
}
