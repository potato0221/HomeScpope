package com.ll.homescope.domain.home.realestate.controller;


import com.ll.homescope.domain.home.realestate.dto.AvgPriceDto;
import com.ll.homescope.domain.home.realestate.dto.AvgPricePerAreaDto;
import com.ll.homescope.domain.home.realestate.service.RealEstateStatsService;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class ApiV1RealEstateStatsController {

    private final RealEstateStatsService realEstateStatsService;

    @GetMapping("/avg-price")
    @Operation(summary = "지역 별 평균 값")
    public RsData<List<AvgPriceDto>> avgPrice(
            @RequestParam int statYear,
            @RequestParam String statHalf
            ) throws IOException {

        List<AvgPriceDto> results = realEstateStatsService.avgPrice(statYear, statHalf);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

    @GetMapping("/avg-price/per-area")
    @Operation(summary = "지역 별 평당 가격")
    public RsData<List<AvgPricePerAreaDto>> avgPriceByRegion(
            @RequestParam int statYear,
            @RequestParam String statHalf
    ) throws IOException {

        List<AvgPricePerAreaDto> results = realEstateStatsService.avgPricePerArea(statYear, statHalf);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }
}
