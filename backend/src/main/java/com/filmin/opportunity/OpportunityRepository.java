package com.filmin.opportunity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    @Query("SELECT o FROM Opportunity o WHERE o.status = 'OPEN' AND " +
           "(:keyword IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:role IS NULL OR LOWER(o.roleNeeded) LIKE LOWER(CONCAT('%', :role, '%'))) AND " +
           "(:location IS NULL OR LOWER(o.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:type IS NULL OR o.opportunityType = :type)")
    Page<Opportunity> searchOpportunities(
        @Param("keyword") String keyword,
        @Param("role") String role,
        @Param("location") String location,
        @Param("type") String type,
        Pageable pageable
    );

    List<Opportunity> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
}
