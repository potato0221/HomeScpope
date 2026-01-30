package com.ll.homescope.domain.home.deal.repository;

import com.ll.homescope.domain.home.deal.entity.CollectedPeriod;
import com.ll.homescope.global.enums.HalfType;
import com.ll.homescope.global.enums.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectedPeriodRepository extends JpaRepository<CollectedPeriod, Long> {
    boolean existsByStatYearAndStatHalfAndPropertyType(int year, HalfType half, PropertyType propertyType);
}
