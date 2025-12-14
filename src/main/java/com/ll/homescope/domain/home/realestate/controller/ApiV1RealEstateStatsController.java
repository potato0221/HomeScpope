package com.ll.homescope.domain.home.realestate.controller;


import com.ll.homescope.domain.home.realestate.dto.AvgPriceByRegionDto;
import com.ll.homescope.domain.home.realestate.service.RealEstateStatsService;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class ApiV1RealEstateStatsController {

    private final RealEstateStatsService realEstateStatsService;

    @GetMapping("/avg-price/region")
    @Operation(summary = "지역 별 평균 값")
    public RsData<List<AvgPriceByRegionDto>> avgPriceByRegion() throws IOException {

        List<AvgPriceByRegionDto> results = realEstateStatsService.avgPriceByRegion();

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }
}
