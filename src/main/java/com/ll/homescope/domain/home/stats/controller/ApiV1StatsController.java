package com.ll.homescope.domain.home.stats.controller;


import com.ll.homescope.domain.home.stats.dto.*;
import com.ll.homescope.domain.home.stats.service.StatsService;
import com.ll.homescope.global.enums.HalfType;
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
public class ApiV1StatsController {

    private final StatsService statsService;

    @GetMapping("/avg-price")
    @Operation(summary = "지역 별 평균 값")
    public RsData<List<AvgPriceDto>> getAvgPrice(
            @RequestParam int statYear,
            @RequestParam String statHalf,
            @RequestParam String propertyType
            ) throws IOException {

        List<AvgPriceDto> results = statsService.avgPrice(statYear, statHalf, propertyType);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

    @GetMapping("/avg-price/per-area")
    @Operation(summary = "지역 별 평당 가격")
    public RsData<List<AvgPricePerAreaDto>> getAvgPriceByRegion(
            @RequestParam int statYear,
            @RequestParam String statHalf,
            @RequestParam String propertyType
    ) throws IOException {

        List<AvgPricePerAreaDto> results = statsService.avgPricePerArea(statYear, statHalf, propertyType);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

    @GetMapping("/trading-volume")
    @Operation(summary = "지역 별 거래량")
    public RsData<List<RegionCountDto>> getTradingVolumeByRegion(
            @RequestParam int statYear,
            @RequestParam String statHalf,
            @RequestParam String propertyType
    ) throws IOException {

        List<RegionCountDto> results = statsService.topRegionByCount(statYear, statHalf, propertyType);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

    @GetMapping("/avg-price/change")
    @Operation(summary = "지역 별 평균가 증감률")
    public RsData<List<RegionPriceChangeDto>> getAvgPriceChangedByRegion(
            @RequestParam int currYear,
            @RequestParam String currHalf,
            @RequestParam String propertyType
    ) throws IOException {

        int prevYear = currHalf.equals(HalfType.H2.name()) ? currYear : currYear - 1;
        String prevHalf = currHalf.equals(HalfType.H2.name()) ? HalfType.H1.name() : HalfType.H2.name();

        List<RegionPriceChangeDto> results = statsService.avgPriceChangeByRegion(prevYear, prevHalf, currYear, currHalf, propertyType);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

    @GetMapping("/avg-price/build-age")
    @Operation(summary = "지역 별 신축/준신축/구축 평균가")
    public RsData<List<RegionBuildAgeAvgPriceDto>> getAvgPriceByBuildAge(
            @RequestParam int statYear,
            @RequestParam String statHalf,
            @RequestParam String propertyType
    ) throws IOException {

        List<RegionBuildAgeAvgPriceDto> results = statsService.avgPriceByRegionAndBuildAge(statYear, statHalf, propertyType);

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, results);
    }

}
