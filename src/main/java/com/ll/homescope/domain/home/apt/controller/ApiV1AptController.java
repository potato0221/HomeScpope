package com.ll.homescope.domain.home.apt.controller;


import com.ll.homescope.domain.home.apt.service.AptService;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import com.ll.homescope.standard.base.Empty;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/apt")
@RequiredArgsConstructor
public class ApiV1AptController {

    private final AptService aptService;

    @GetMapping("/add")
    @Operation(summary = "반기 별 데이터 호출")
    public RsData<Empty> fetch(
            @RequestParam int year,
            @RequestParam String half
    ) {
        aptService.fetchByYear(year, half);

        return RsData.of(Msg.E200_0_CREATE_SUCCEED);
    }

}
