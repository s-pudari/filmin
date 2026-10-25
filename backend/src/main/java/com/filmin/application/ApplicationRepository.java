package com.filmin.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByOpportunityIdAndApplicantId(Long opportunityId, Long applicantId);

    Optional<Application> findByOpportunityIdAndApplicantId(Long opportunityId, Long applicantId);

    List<Application> findByApplicantIdOrderBySubmittedAtDesc(Long applicantId);

    List<Application> findByOpportunityIdOrderBySubmittedAtDesc(Long opportunityId);
}
