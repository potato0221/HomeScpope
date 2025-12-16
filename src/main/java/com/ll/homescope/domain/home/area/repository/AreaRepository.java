package com.ll.homescope.domain.home.area.repository;

import com.ll.homescope.domain.home.area.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AreaRepository extends JpaRepository<Area, String> {

    boolean existsByAreaCode(String areaCode);

    @Query("SELECT a.areaCode FROM Area a")
    List<String> findAllAreaCodes();
}
