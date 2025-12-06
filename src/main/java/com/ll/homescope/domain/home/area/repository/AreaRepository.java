package com.ll.homescope.domain.home.area.repository;

import com.ll.homescope.domain.home.area.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, Integer> {

    boolean existsByAreaCode(int areaCode);
}
