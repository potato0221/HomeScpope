package com.ll.homescope.domain.home.apt.repository;

import com.ll.homescope.domain.home.apt.entity.CollectedPeriod;
import com.ll.homescope.global.enums.HalfType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectedPeriodRepository extends JpaRepository<CollectedPeriod, Long> {
    boolean existsByStatYearAndStatHalf(int year, HalfType half);
}
