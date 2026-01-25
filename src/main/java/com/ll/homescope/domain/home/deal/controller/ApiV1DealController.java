package com.ll.homescope.domain.home.deal.controller;


import com.ll.homescope.domain.home.deal.dto.CollectedPeriodDto;
import com.ll.homescope.domain.home.deal.service.DealService;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import com.ll.homescope.standard.base.Empty;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/deal")
@RequiredArgsConstructor
public class ApiV1DealController {

    private final DealService dealService;

    @GetMapping("/add")
    @Operation(summary = "반기 별 데이터 저장")
    public RsData<Empty> fetch(
            @RequestParam int collectedYear,
            @RequestParam String collectedHalf,
            @RequestParam String propertyType
    ) {
        dealService.fetchByYear(collectedYear, collectedHalf, propertyType);

        return RsData.of(Msg.E200_0_CREATE_SUCCEED);
    }

    @GetMapping("/collected/list")
    @Operation(summary = "수집 된 년도, 반기 목록")
    public RsData<List<CollectedPeriodDto>> collectedPeriodList(){

        List<CollectedPeriodDto> dtos = dealService.getCollectedPeriodList();

        return RsData.of(Msg.E200_1_INQUIRY_SUCCEED, dtos);
    }

}
